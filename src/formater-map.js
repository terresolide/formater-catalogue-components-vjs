/**
 * FtMap 
 * @property {L.map} 			map 
 * @property {Array of L.layer} layers
 * @method initialize
 * @method resize
 * @method handleReset
 * @method displayResult
 * 
 * 
 */


module.exports = function( L ){
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
	var _tooltip = null;
	var _tooltip_timer = null;
	var _global_observations = [];
	/** @todo changer de méthode pour les marqueurs et couleurs (fichier configuration globale???)**/
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
	this.layers = [];
	
	this.handleReset = function(){
		var _this = this;
		var layers = this.layers;

		layers.forEach( function(layer){
			_this.layerControl.removeLayer(layer);
			if( _this.map.hasLayer( layer)){
				layer.remove();
			}
			
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
		_tooltip = L.tooltip();
		

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

		
		var query = event.detail.query;
		var _layerControl = this.layerControl;
	    var cds = query.cds;
        var count = 0;
        var _map = this.map;
		var layer = L.geoJSON(event.detail.result, {

              pointToLayer: function (feature, latlng) {
            	 
                  var marker = new L.Marker( latlng, {icon: bcmt.iconMarker });

                  return marker;
              },
              onEachFeature: function( feature, layer){
            	  count++;
            	 
            	  var options = {
            			  properties: feature.properties,
            			  query: query,
            			  title: feature.properties.name[_lang],
            			  cds:cds
            	  }
            	  L.setOptions( layer, options);
            	 
            	 
            	  layer.on('click', function(e){
            		  this.createPopup(e);
            	  })
           	 
            	 // layer.bingTooltip( feature.properties.name[lang]).addTo(_map);
            	  
            	  layer.on("mouseover", function(evt){
            		  if(feature.geometry.type != "Point"){
            			 // this.bindTooltip( layer.options.title);
            			  _tooltip.setContent( layer.options.title);
            			 _tooltip_timer = setTimeout( function(){ _map.openTooltip(_tooltip);}, 1000);
            			//  _map.openTooltip(_tooltip );
            			 if(evt.latlng);
            			  _tooltip.setLatLng( evt.latlng);
            			  if( typeof this.setStyle == "function")
            			 this.setStyle({ fillOpacity:0.6});
            		  }else{
            			  _map.closeTooltip(_tooltip);
            		  }
            		  
            	  })
            	  layer.on("mousemove", function(evt){
            		  if(feature.geometry.type != "Point"){
            			  _tooltip.setLatLng( evt.latlng);
            		  }
            		  
            	  })
            	  layer.on('mouseout', function(evt){
            		  if( typeof this.setStyle == "function")
            		   this.setStyle({ fillOpacity:0.4});
            		   _map.closeTooltip(_tooltip);
            		   clearTimeout( _tooltip_timer);
            	  })
            	  return layer;
            	 
              },
              filter: function(feature){
            	  if( feature.properties.name.fr == "Global"){
            		  feature.properties.observations.forEach( function( obs){
            			  _global_observations.push(obs);
            		  })
            		  return false;
            	  }else{
            		  return true;
            	  }
              },
              style: function(feature) {
                 if( typeof feature.properties.style != "undefined")
                 return  {color:feature.properties.style.fill, fillOpacity:0.4};
              }
          }).on("add", function(){
       
        	 
        	 
          }).on( "remove", function(){
        	  var event = new CustomEvent("closeSheet", {});
        	  document.dispatchEvent( event);
          }).addTo( this.map);
		
		if( count == 0 ){
			return;
		}
		switch( cds){
		case "bcmt":
			 this.layerControl.addOverlay( layer, _t("Observatories"), _t("Geomagnetism"));
			 break;
		case "isgi":
			 this.layerControl.addOverlay( layer, _t("Geomagnetic_zones"), _t("Geomagnetism"));
		     break;
		}
		this.layers.push( layer);

          
      }
	

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
		console.log("toogle");
		if( _selected_layer != null){
			_selected_layer.close();
			
    	}
		
		if(this instanceof L.Marker){
			this.setIcon( bcmt.selectedMarker);
		}else{
			if(! this.options.defColor)
			this.options.defColor = this.options.color;
			this.setStyle( { color:"red"});
		}
		
		_selected_layer = this;
		return this;
	}
	L.Layer.prototype.createPopup = function( evt ){
		if( this.popup){
			return;
		}
		this.closeTooltip();
		var _layer = this;
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
				
				
				
				var event = new CustomEvent("unselectInput", { detail:{}});
	      	  	 document.dispatchEvent(event);
	      	  	// setTimeout( function(){
				 if(this != _selected){
					// if( _layer != _selected_layer)
					 //console.log( _selected.className);
					 if( _selected_layer != _layer)
					 _layer.toggle( );
					 var event = new CustomEvent("displayInfo", { detail:{ layer:_layer, observation: obs, index: index}});
		       	    document.dispatchEvent(event);
				 }else if(_selected_layer){
					    console.log( "className  selected => close");
						 _selected_layer.close();
				 }
				 _selected = toggle( this);
				 //
				 searchData( obs , _layer.options.query, _layer.options.cds);
	      	  	//}, 1);
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
		this.bindPopup( node, );
		
		this.openPopup( evt.latlng);
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
	function searchData( obs, query, cds){
		console.log( "searchData");
		console.log( query);
		var _cds = cds;

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
			    	if(_cds == "isgi"){
			    		//recuperation du lien archive
			    		var url = obs.data.meta.get("isgi_url");
			    		console.log(url);
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
	
	document.addEventListener("closeSheet", function(e){
		if( _selected){
			var event = new MouseEvent("click", {});
			_selected.dispatchEvent(event);
		}
		
	})
	
	
	
	return this;
}