/**
 * 
 */

var L = require('./leaflet.extend.js');
function FtMap(){
	var _disabledUrl = new Array();
	var _lang ="fr";
	var _treatedEvents = new Array();
	var _translations= {
		"Geomagnetism":{
			fr:"Géomagnétisme",
			en: "Geomagnetism"
		},
		"Observatories":{
			fr:"Observatoires",
			en: "Observatories"
		},
		"Geomagnetic_zones":{
			fr:"Zones géomagnétiques",
			en: "Geomagnetic zones"
		}
	}

	var bcmt = {
		iconMarker: new L.AwesomeMarkers.icon( { icon: 'magnet', prefix: 'fa', markerColor: 'orange'}),
		selectedMarker: new L.AwesomeMarkers.icon( { icon: 'magnet', prefix: 'fa', markerColor: 'red'})
	}
	function _t( name ){
		
		if(!_translations[name]){
			return name;
		}else{
			return _translations[name][_lang];
		}
		
	}
	Array.prototype.get= function( name ){
		var i=0;
		find = false;
		while( !find && i< this.length){
			if( this[i].name == name){
				find = this[i].content;
			}
			i++;
		}
		return find;
	}
	

	this.map = null;
	this.observatories = null;
	this.layers = [];
	
	this.handleReset = function(){
		var _this = this;
		var layers = this.layers;
		

		layers.forEach( function(layer){
			console.log( "remove layer");
			console.log( layer);
			_this.layerControl.removeLayer(layer);
			if( _this.map.hasLayer( layer)){
				layer.remove();
			}
		//	_this.map.removeLayer(layer);
			
		})
		this.layers = [];
		
	  }
	  
	this.initialize = function( container, lang){
	     _lang = lang;
		
		 this.map = L.map( container, {selectArea:true}).setView([51.505, -0.09], 3);
		// console.log( this.map);
		  L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
		      attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
		      maxZoom: 18,
		      minZoom:1
		  }).addTo( this.map );
		  this.map.on("resize", this.resize);
		  this.selectArea = L.selectArea(
				  {
					  map:this.map, 
					  options:{
						  width:400, 
						  height:300, 
						  color:"#DD9946"
					  }});
	     this.layerControl = L.control.groupedLayers();
		this.layerControl.addTo( this.map);

	}
	this.resize = function( ){
		if( !this.map) return;
		 var hw = window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight;
	     
		this.height = hw - this.map._container.getBoundingClientRect().top -5;
		this.map._container.style.height = Math.round(this.height ) +"px";
		this.map.invalidateSize()
	}
	this.displayResults = function( event ){
		 
		if( _treatedEvents.indexOf( event.detail.id )>=0){
			return;
		}
		_treatedEvents.push(event.detail.id);

		var lang = this.lang;
		var query = event.detail.query;
		var _layerControl = this.layerControl;
	    var cds = query.cds;
	    console.log(cds);
		var layer = L.geoJSON(event.detail.result, {

              pointToLayer: function (feature, latlng) {

                  var marker = new L.Marker(
                          latlng,
                          {icon: bcmt.iconMarker,
                           name: feature.properties.identifiers.customId,
                           title: feature.properties.name[lang],
                           properties: feature.properties,
                           query: query
                          });

//                  marker.on('click', function(e ){
//                	  this.createPopup(lang);
//                  })
                  return marker;
              },
              onEachFeature: function( feature, layer){
            	  layer.options.properties = feature.properties;
            	  layer.on('click', function(e){
            		  this.createPopup(lang);
            	  })
              }
          }).on("add", function(){
       
        	 
        	 
          }).on( "remove", function(){
        	  var event = new CustomEvent("closeSheet", {});
        	  document.dispatchEvent( event);
          }).addTo( this.map);
		switch( cds){
		case "bcmt":
			 this.layerControl.addOverlay( layer, _t("Observatories"), _t("Geomagnetism"));
			 break;
		case "isgi":
			 this.layerControl.addOverlay( layer, _t("Geomagnetic_zones"), _t("Geomagnetism"));
		     break;
		}
		this.layers.push( layer);
		   //this.observatories.addTo( this.map);
          
      }
	
	/*L.Marker.prototype.close = function( ){
		
		
		this.setIcon( bcmt.iconMarker );
		_selected_marker = null;
	}
	L.Marker.prototype.toggle = function( ){
		
		if( _selected_marker != null){
			_selected_marker.close();
			
			}
			
			this.setIcon( bcmt.selectedMarker );
			_selected_marker = this;
			return this;

	}*/
	L.Layer.prototype.close = function(){
		console.log( "close");
		console.log( this.options.color);
		if(this instanceof L.Marker){
			this.setIcon( bcmt.iconMarker);
		}else{
			this.setStyle( { color: this.options.defColor});
		}
		_selected_layer = null;
	}
	L.Layer.prototype.toggle = function(){
		if( _selected_layer != null){
			_selected_layer.close();
			
			}
		console.log( this.options);
		if(this instanceof L.Marker){
			this.setIcon( bcmt.selectedMarker);
		}else{
			this.options.defColor = this.options.color;
			this.setStyle( { color:"red"});
		}
		
		_selected_layer = this;
		return this;
	}
	L.Layer.prototype.createPopup = function(  ){
		if( this.popup){
			return;
		}
		var _this = this;
		var node = document.createElement("div");
		var h4 = document.createElement("h4");
		h4.textContent = this.options.properties.name[_lang];
		node.appendChild( h4);
		var div = document.createElement("div");
		div.innerHTML = this.options.properties.description[_lang];
		node.appendChild( div);
		if( this.options.properties.organisation){
			var ul = document.createElement("ul");
			this.options.properties.organisation.forEach( function( org, index){
				var li = document.createElement("li");
				li.textContent = org;
				ul.appendChild(li);
			});
			node.appendChild(ul);
		}
		this.options.properties.observations.forEach( function( obs, index){
			var input = document.createElement("input");
			input.setAttribute("type", "button");
			input.setAttribute( "value", obs.title[_lang]);
			
			node.appendChild( input);
			function displayInfo(e){
				if(_selected_layer)
				_selected_layer.close();
				var event = new CustomEvent("unselectInput", { detail:{}});
	      	  	 document.dispatchEvent(event);
				 if(this.className != "selected"){
					 
					_selected_layer = _this.toggle( );
					 var event = new CustomEvent("displayInfo", { detail:{marker:_this, observation: obs, index: index}});
		       	    document.dispatchEvent(event);
				 }
				 _selected = toggle( this);
				 searchData( obs , _this.options.query);
			}
			
			input.addEventListener("click", displayInfo);
			/*input.addEventListener("closeSheet", function(){
				console.log( "close");
				if( _selected_marker){
					_selected_marker.close();
				}
				this.className = "";
			})*/
		});
		this.popup = node;
		this.bindPopup( node );
		
		this.openPopup();
	}

	/** selected element on the map **/
	var _selected = null;
	var _selected_marker = null;
	var _selected_layer =null;
	function toggle(node){
		if(_selected){
			_selected.className = "";
		}

		if( _selected == node){
			_selected = null;
		}else{
			node.className = "selected";

			_selected = node;
		}
		return _selected;
	}
	function searchData( obs, query){
		if(!obs.process){
			obs.process = {}
		}
		if( !obs.api || !obs.api.url){
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
				   var links = obs.data.meta.get("FTP_DOWNLOAD_LINK");
				
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
				   var event = new CustomEvent("findData", {detail: { obs: obs }});
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
			obs.api.parameters["start"] = query.start;
		}
		if( query && query.end){
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
	
	document.addEventListener("closeSheet", function(e){
		if( _selected){
			var event = new MouseEvent("click", {});
			_selected.dispatchEvent(event);
		}
		
	})
	
	
	
	return this;
}
module.exports = new FtMap();