/**
 * 
 */
L.SelectedLayer =   L.Evented.extend({
	layer:null,
	//selected button
	button:null,
	popup:null,
	imageLayer:null,
	bbox:null,
	imageListener:null,
	disabledUrl:[],
	map:null,
	opacity:1,
	options:{
		lang: "fr"
	
	},
	initialize: function( map,options){
		this.map = map;
		L.Util.setOptions(this, options);
		this.imageListener = this.displayImage.bind( this);
		document.addEventListener("selectedImage",this.imageListener);
		
		
	},
	change:function( button,layer){
		
		if( this.button != button){
			this.close();
			this.button = button;
			this.button.className = "selected";
	
			layer.select();
			this.layer = layer;
			this.opacity = this.layer.options.fillOpacity;
			var obs = layer.options.properties.observations[ this.button.dataset.index];
			var event = new CustomEvent("displayInfo", { detail:{ layer:layer, observation: obs, index: this.button.dataset.index}});
	       	document.dispatchEvent(event);
	       	this.searchData( obs , layer.options.query, layer.options.cds);
		}else{
			this.close();
		}
		

	},
	isImagePlaying(layer){
		if( layer == this.layer && this.imageLayer ){
			return true;
		}else{
			return false;
		}
		
	},
	displayImage( evt ){


		this.map.closePopup();

		 var imageBounds = [[18.568748337, -99.529022784], [19.963193897, -98.467355268]];

		if( this.layer){
			this.layer.setStyle({fillOpacity:0});
		}
		if( ! this.imageLayer){
			this.imageLayer = L.imageOverlay( 
					  evt.detail.img, 
					  imageBounds,
					  {
						  crossOrigin:true,
						  zIndex:2000, 
						  opacity:0.6, 
						  interactive:true, 
						  bubblingMouseEvents:false,
						  alt: evt.detail.date
				      });
			this.imageLayer.on( "click", function( evt){
				var event = new CustomEvent( "nextImageEvent");
				document.dispatchEvent( event);
			});
			this.imageLayer.on( "dblclick", function( evt){
				this.removeEventParent(evt);
			});
			this.imageLayer.addTo( this.map);
			
		
		}else{
			this.imageLayer.setUrl( evt.detail.img);

		}
		var node = this.imageLayer.getElement();
		node.setAttribute( "title", evt.detail.date);
		node.setAttribute( "alt", evt.detail.date);
	
		
		 this.imageLayer.bringToFront();
		//this.imageLayer.setUrl( evt.detail.img);
	},
	close: function(){
		if( this.layer == null){
			return;
		}
		var event = new CustomEvent("unselectInput", { detail:{}});
		document.dispatchEvent(event);
		if( this.button){
		this.button.className = "";
			this.button = null;
			if( this.imageLayer){
				this.imageLayer.remove();
				this.imageLayer = null;
				
			}
		}
		if( typeof this.layer.setStyle == "function"){
			this.layer.setStyle({fillOpacity: this.opacity});
		}
		this.layer.unselect();
		this.layer = null;
	},
	searchData( obs, query, cds){
		
		var _cds = cds;
        var _disabledUrl = this.disabledUrl;
		if(!obs.process){
			obs.process = {}
		}
		if( !obs.api || !obs.api.url ){
			obs.process.status = "DONE";
		}
		if( obs.process.status == "DONE" || obs.process.status == "ERROR" || obs.process.status == "WAITING"){
			return;
		} 
		obs.process.status = "WAITING";
		var xhttp = new XMLHttpRequest(); 
		xhttp.responseType = "json";
		
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//console.log( JSON.parse(this.responseText));
				//console.log(_marker.options);
			   // document.getElementById("demo").innerHTML = this.responseText;
			   if(this.response.error){
				   obs.process.status = "ERROR";
				   if( this.response.error == "FTP_FAILED"){
					   //DISABLE THE URL FOR OTHER WHICH SAME SERVER
					  
					  _disabledUrl.push( obs.api.name);
				   }
			   }else{
				   obs.process.status = "DONE";
				   obs.data = this.response;
				   var links= [];
				   if( obs.data.meta)
				   links = obs.data.meta.get("FTP_DOWNLOAD_LINK");
				
			    	 //DELETE OLD LINK FTP
			    	 if( obs.links){
			    		 var i = obs.links.length-1;
			    		while(i>=0){
			    			if(obs.links[i].prov){
			    				obs.links.splice(i,1);
			    			}
			    			i--;
			    		}
			    		for(var i=0;i<links.length;i++){
			    			 links[i].prov = true;
			    			obs.links.push(links[i]);
			    		}
			    	 }
			    	if(_cds == "isgi"){
			    		//recuperation du lien archive
			    		var url = obs.data.meta.get("isgi_url");
			    		
			    		if( url){
			    			var link = {
			    					type: "HTTP_DOWNLOAD_DIRECT_LINK",
			    					url: url,
			    					description:{fr:"archive.zip", en:"archive.zip"},
			    					prov:true
			    			}
			    			obs.links.push(link);
			    		}
			    	}
			    
			       obs.query = query;
				   var event = new CustomEvent("findData", {detail: { obs: obs, cds: _cds}});
				    document.dispatchEvent(event);
	   
			   }
			    
			  }
			  if (this.readyState == 4 && this.status == 404) {
				  obs.process.status = "ERROR";
				  _disabledUrl.push( obs.api.name);
			  }
		}
		var req = obs.api.url;
		
		
		
		if( query && query.start){
			if( !obs.api.parameters){
				obs.api.parameters = {};
			}
			obs.api.parameters["start"] = query.start;
		}
		if( query && query.end){
			if( !obs.api.parameters){
				obs.api.parameters = {};
			}
			obs.api.parameters["end"] = query.end;
		}
		//console.log( obs.api.parameters.type);
		//if( obs.api.parameters.length>0){
			var i = 0;
			for(var key in obs.api.parameters){
				//console.log( key);
				if(i == 0){
					req += "?";
				}else{
					req += "&";
				}
				i++;
				req += key +"="+obs.api.parameters[key];
			}
		//}
		//console.log( req);
		xhttp.open("GET", encodeURI( req ), true);
		if( _disabledUrl.indexOf(obs.api.name)<0){
			xhttp.send();
		}
		
		
	}

});
L.selectedLayer = function(map, options) {
    return new L.SelectedLayer(map, options);
}
module.exports = L.selectedLayer;