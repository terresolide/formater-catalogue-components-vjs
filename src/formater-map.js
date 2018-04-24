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
	this.map = null;
	this.layers = [];
	
	var _disabledUrl = new Array();
	var _lang ="fr";
	var _treatedEvents = new Array();
	var _translations= {
		"Geomagnetism":{
			fr:"Géomagnétisme",
			en: "Geomagnetism"
		},
		"Geodesy":{
			fr:"Géodésie",
			en:"Geodesy"
		},
		"Observatories":{
			fr:"Observatoires",
			en: "Observatories"
		},
		"Geomagnetic_zones":{
			fr:"Zones géomagnétiques",
			en: "Geomagnetic zones"
		},
		"Selected_area":{
			fr: "Aire sélectionnée",
			en: "Selected area"
		},
		"Global_data":{
			fr: "Données globales",
			en: "Global data"
		},
		"Earth":{
			fr: "Terre",
			en: "Earth"
		},
		"Layers":{
			fr: "Système de couches",
			en: "Layers"
		}
	}
	var _tooltip = null;
	var _tooltip_timer = null;
	var _global_observations = [];
	var _selected = null;
	var _selectArea = null;
	var _layerControl = null;
	var _earthControl = null;
    var _layerpopup = null;
    var _eventClosed = null;
    var _bounds = [];
	/** @todo changer de méthode pour les marqueurs et couleurs (fichier configuration globale???)**/
	var bcmt = {
		iconMarker: new L.AwesomeMarkers.icon( { icon: 'magnet', prefix: 'fa', markerColor: 'orange', html:'2/3'}),
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
	
    function _addSelectArea2LayerGroup( evt ){
    	
    	if( typeof evt.detail.query.bbox != "undefined" && _selectArea.rectangle){
    		_selectArea.rectangle.remove();
   
    		_layerControl.addSelectedArea( _selectArea.rectangle, _t("Selected_area"));
        }
    }

	
	this.handleReset = function(){
		var _this = this;
		var layers = this.layers;
		_layerControl.reset();
		layers.forEach( function(layer){
			//_layerControl.removeLayer(layer);
			if( _this.map.hasLayer( layer)){
				layer.remove();
			}		
		})
		
		this.layers = [];
		_global_observations = [];
		_earthControl.reset();
		_bounds = [];
		
	  }
	
	function getDataUri(url, callback) {
	    var image = new Image();

	    image.onload = function () {
	        var canvas = document.createElement('canvas');
	        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
	        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

	        canvas.getContext('2d').drawImage(this, 0, 0);

	        // Get raw image data
	        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

	        // ... or get as Data URI
	      //  callback(canvas.toDataURL('image/png'));
	    };

	    image.src = url;
	}

	  
	this.initialize = function( container, lang){
		 _lang = lang;
		
		 this.map = L.map( container, {selectArea:true, closePopupOnClick : true}).setView([51.505, -0.09], 3);
		
		 this.map.on( "zoom", function(e){ this.updateAllPolygons();})
		 L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
			{
			  attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
		      maxZoom: 18,
		      minZoom:2
		      
		    }).addTo( this.map );
		  this.map.on("resize", this.resize);
		  _selectArea = L.selectArea(
				  {
					  map:this.map, 
					  options:{
						  width:400, 
						  height:300, 
						  color:"#DD9946"
					  }});
		  _layerControl = L.control.groupedLayers(null, null,  {groupCheckboxes: true, title: _t('Layers')});
		  _layerControl.addTo( this.map);
		  _tooltip = L.tooltip();
		
		  document.addEventListener("closeSheet", function(e){
				if( _selected.button){
					var event = new MouseEvent("click", {});
					_selected.button.dispatchEvent(event);
				}
		  });
		  
		  _selected = L.selectedLayer( this.map,{lang: lang});
		  var options = {  lang:lang, title: _t('Global_data'), name: _t("Global_data")};
		_earthControl = L.control.earthLayer(_selected, options);
		_earthControl.addTo( this.map);
		
//		 var imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
//		 var _map = this.map;
//		 var imageLayer = L.imageOverlay( "/geotiff/geo_TOT_20160513.unw.png", imageBounds,{crossOrigin:true});
//		 imageLayer.addTo( _map);
//		 imageLayer.bringToFront();
//		getDataUri(  "/geotiff/geo_TOT_20160513.unw.png", function(dataUri){
//			 var imageLayer = L.imageOverlay( dataUri, imageBounds,{crossOrigin:true});
//			 imageLayer.addTo( _map);
//			 imageLayer.bringToFront();
//		});
		
		

	}
	
	this.createTriangles = function( latlngBounds, style){
		
		var centerG = latlngBounds.getCenter();
		var center = this.map.latLngToLayerPoint(latlngBounds.getCenter());
		console.log( center);
		
		var top = this.map.latLngToLayerPoint( latlngBounds.getNorthWest());
		console.log( top);
		var pointTop = L.point( center.x, top.y - 10);
		var latlng = this.map.layerPointToLatLng( pointTop);
		var path = [latlngBounds.getNorthWest(), latlng, latlngBounds.getNorthEast()];
		console.log(path);
		var polygon = L.polygon( path, style).addTo( this.map);
		
		
		//var bounds = [ latlngBounds.getNorthEast(), latlngBounds.getNorthWest()];
		//L.marker( bounds.getCenter()).addTo( this.map);
	}
	this.resize = function( ){
		if( !this.map) return;
		 var hw = window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight;
	     
		this.height = hw - 30;// this.map._container.getBoundingClientRect().top -5;
		this.map._container.style.height = Math.round(this.height ) +"px";
		this.map.invalidateSize()
	}

	this.updateObservations = function(event){
		
	}
	this.displayResults = function( event ){
		_addSelectArea2LayerGroup( event );
		 
		if( _treatedEvents.indexOf( event.detail.id )>=0){
			return;
		}
		_treatedEvents.push(event.detail.id);

		var count = 0;
		var cds = event.detail.query.cds;
		var query = event.detail.query;

		//var _layerControl = this.layerControl;
        var _map = this.map;
        var _this = this;
		var layer = L.geoJSON(event.detail.result, {

            pointToLayer: function (feature, latlng) {
            	
            	var iconClass = "";
          	    if( feature.properties.inTemporal == 0){
          	    	//grey marker
          	    	var color = "cadetblue";
          	    	var iconClass = "ft-empty-obs";
          	    }else{
          	    	var color = "orange";
          	    	
          	    }
          	    var html = feature.properties.inTemporal +"/"+ feature.properties.observations.length;
          	    var icon =  new L.AwesomeMarkers.icon( { 
	    			icon: 'magnet', 
	    			prefix: 'fa', 
	    			markerColor: color,
	    			iconClass:iconClass,
	    			html:html});
                var marker = new L.Marker( latlng, {icon: icon });
                
                return marker;
            },
            onEachFeature: function( feature, layer){
	          	  count++;
	          	 
	          	  var options = {
	          			  properties: feature.properties,
	          			  query: query,
	          			  title: feature.properties.name[_lang],
	          			  cds:cds //cds devrait être un niveau en  dessous ou bien extrait des metadatas
	          	  }
	          	  L.setOptions( layer, options);
	          	 
	          	  //bounds
	          	  if( layer instanceof L.Marker){
	          		  _bounds.push( layer.getLatLng());
	          	  }else{
	          		  var bounds = layer.getBounds();
	          		
	          		 for( var i in bounds){
	          			 _bounds.push( bounds[i]);
	          		 }
	          	  }
	          	  
	          	  if( layer instanceof L.Polygon)
	          	  layer.addFramed( feature.properties.style);
	          	/* if( feature.properties.style && feature.properties.style.border == "triangle"){
            		 //create triangles around!
	          		 console.log(layer);
	          		 layer.addFramed();
	          		console.log( layer);
	          		
            		// _this.createTriangles( layer.getBounds() , feature.properties.style);
            	 }*/
	          	 
	          	  layer.on('click', function(e){
	          		  L.DomEvent.stopPropagation(e);
	          		  this.showPopup(e);
	          		 
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
	          			  if( typeof this.setStyle == "function" && !_selected.isImagePlaying( this) )
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
	          		  if( typeof this.setStyle == "function" && !_selected.isImagePlaying( this))
	          		   this.setStyle({ fillOpacity:0.4});
	          		   _map.closeTooltip(_tooltip);
	          		   clearTimeout( _tooltip_timer);
	          	  })
	          	  return layer;
          	 
              },
              filter: function(feature){
            	  if( feature.properties.name.fr == "Global"){
            		  feature.properties.observations.forEach( function( obs){
            			  obs.cds = cds;
            			  obs.query = query;
            			  _global_observations.push(obs);
            		  })
            		  return false;
            	  }else{
            		  return true;
            	  }
              },
              style: function(feature, layer) {
                 if( typeof feature.properties.style != "undefined"){
                	
                	 return  {color:feature.properties.style.fill, fillOpacity:feature.properties.style.fillOpacity, weight: feature.properties.style.strokeWidth};
                 
                 }
                 
                 
              }
          }).on("add", function(){
        	  
        	 
        	 
          })//.on( "remove", function(){
        	 // var event = new CustomEvent("closeSheet", {});
        	 // document.dispatchEvent( event);
        // })
          .addTo( this.map)
          .eachLayer( function(layer){
        	  if( typeof layer.buildFramed != "undefined")
        	  layer.buildFramed();
        	  
          });
		
		if( count == 0 ){
			return;
		}
		
		_earthControl.addObservations( _global_observations ,query);
	
		//@todo pour le moment on fait les requêtes par cds, mais il est possible
		// que un même layer accueille les observations de différents cds.
		// comment s'organiser??
		switch( cds){
		case "bcmt":
			 _layerControl.addOverlay( layer, _t("Observatories"), _t("Geomagnetism"));
			 break;
		case "isgi":
			 _layerControl.addOverlay( layer, _t("Geomagnetic_zones"), _t("Geomagnetism"));
		     break;
		case "grenoble":
			_layerControl.addOverlay( layer, _t("PEPS truc"), _t("Geodesy"));
		}
		this.layers.push( layer);
		this.map.fitBounds(_bounds);
      }
	L.Layer.prototype.select = function(){
		if(this instanceof L.Marker){
			var icon = this.options.icon;
			this.options.defColor = icon.options.markerColor;
			icon.options.markerColor = "red";
		   // var icon =  new L.AwesomeMarkers.icon( );
			this.setIcon( icon);
		}else if( this instanceof L.Control){
			
		}else if( this instanceof L.Polygon){
			 this.select();
		}else if( this instanceof L.Layer){

			if(! this.options.defColor)
				this.options.defColor = this.options.color;
				this.setStyle( { color:"red"});
		}
	}
	L.Layer.prototype.unselect = function(){
		if(this instanceof L.Marker){
			var icon = this.options.icon;
			icon.options.markerColor = this.options.defColor;
		   // var icon =  new L.AwesomeMarkers.icon( );
			this.setIcon( icon);
		}else if( this instanceof L.Control){
			
		}else if( this instanceof L.Polygon){
			this.unselect();
		}else if( this instanceof L.Layer){
			if( this.options.defColor){

				this.setStyle( { color:this.options.defColor});
			}
		}
	}
	L.Layer.prototype.createPopup = function( ){
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
		//@todo voir plus loin
		var cds = this.options.cds;
		this.options.properties.observations.forEach( function( obs, index){
			var input = document.createElement("input");
			input.setAttribute("type", "button");
			input.setAttribute( "value", obs.title[_lang]);
			input.setAttribute("data-index", index);
			//@todo cds devrait être dans observation en retour ou calculer à partir de obs.formaterDataCenter.code 
			//ou obs.formaterDataCenter.name
			input.setAttribute("data-cds", cds);
			input.setAttribute("title", obs.abstract[_lang]);
			if( ! obs.inTemporal){
				input.setAttribute("class", "ft-empty");
			}
			node.appendChild( input);
			input.addEventListener("click", function(){
					_selected.change(this, _layer);
			});
			
		});
		this.popup = node;
	 
		var lpopup = this.bindPopup( node);
		lpopup.on("popupclose", function(evt){
			//_eventclosed = Object.values(evt._eventParents)[0];
			//if(_selected.mode != "visualisation")
				_selected.close();
	
			 
			
		})
		lpopup.on("popupopen", function(evt){
			
			var evt = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window
			});
			node.querySelector("input").dispatchEvent(evt);
		})
		
		
	}

	L.Layer.prototype.showPopup = function( evt ){

		// close earth layer
		_earthControl._collapse();
	   
		if( _layerpopup == this){
			_layerpopup = null;
			if(!(this instanceof L.Marker)){
			  //trouble with popup on polygon, when click always open??!
				//this._map.closePopup( this.);
			  this._map.closePopup();
			  throw "exit";
			}
			
			return;
			
		}

		_layerpopup = this;
		if( this.popup){
			return;
		}
	
		this.createPopup();
		this.openPopup( evt.latlng);
		this.closeTooltip();
		
		
	}
	
		
	
	
	return this;
}