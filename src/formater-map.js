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
		
		 this.map = L.map( container, {selectArea:true}).setView([51.505, -0.09], 3);
		
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
		  _selected = L.selectedLayer( this.map,{lang: lang});
		  document.addEventListener("closeSheet", function(e){
				if( _selected.button){
					var event = new MouseEvent("click", {});
					_selected.button.dispatchEvent(event);
				}
		  });
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
	this.resize = function( ){
		if( !this.map) return;
		 var hw = window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight;
	     
		this.height = hw - 30;// this.map._container.getBoundingClientRect().top -5;
		this.map._container.style.height = Math.round(this.height ) +"px";
		this.map.invalidateSize()
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
		
		_earthControl.addObservations( _global_observations);
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

          
      }
	L.Layer.prototype.select = function(){
		if(this instanceof L.Marker){
			this.setIcon( bcmt.selectedMarker);
		}else if( this instanceof L.Control){
			
		}else if( this instanceof L.Layer){
			if(! this.options.defColor)
				this.options.defColor = this.options.color;
				this.setStyle( { color:"red"});
		}
	}
	L.Layer.prototype.unselect = function(){
		if(this instanceof L.Marker){
			this.setIcon( bcmt.iconMarker);
		}else if( this instanceof L.Control){
			
		}else if( this instanceof L.Layer){
			if( this.options.defColor){

				this.setStyle( { color:this.options.defColor});
			}
		}
	}


	L.Layer.prototype.createPopup = function( evt ){
		
		_earthControl._collapse();
	   
		if( _layerpopup == this){
			_layerpopup = null;
			this._map.closePopup();
			
		}
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
			input.setAttribute("data-index", index);
			input.setAttribute("title", obs.abstract[_lang]);
			node.appendChild( input);
			input.addEventListener("click", function(){
					_selected.change(this, _layer);
			});
			
		});
		this.popup = node;
	
		this.bindPopup( node, );
		this.openPopup( evt.latlng);
		_layerpopup = this;
	}
	
		
	
	
	return this;
}