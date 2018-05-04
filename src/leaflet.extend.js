/**
 * 
 */
var L = require("leaflet");

L.Map.include({

	updateAllPolygons(){
		 var layers = this._layers;
		 for( var i in layers){
			 if( layers[i] instanceof L.Polygon ){
				 layers[i].change();
			 }
		 }
	}
});

L.Polygon.include({
	// problème avec le type de triangles
	// -> est défini comme un tableau (associatif) 
	// -> mais est compris comme un object ??
	triangles:[],
	framed: false,
	tooltip:null,
	addFramed:function( style){
		if( style && style.border == "triangle"){
			this.framed = true;
		
		}
	},
	update: function(){
		//parent update (layer?)
		 var color = L.Layer.prototype.update.call( this);

		if( this.framed ){
			if( Object.keys(this.triangles).length < 4){
				return;
			}
			var _this = this;
			["North", "East", "South", "West"].forEach( function( side ){
				_this.triangles[ side].feature.properties.inTemporal = _this.feature.properties.inTemporal;
				_this.triangles[ side ].update();
				if( color == "red"){
					_this.triangles[side].select();
				}
			})
		}
	},
	buildFramed: function( tooltip){
		if( ! this.framed ){
			return;
		}
		this.tooltip = tooltip;
		if( this._map != null){
			this.centerG = this.getCenter();
			this.nw = this.getBounds().getNorthWest();
			this.ne = this.getBounds().getNorthEast();
			this.sw = this.getBounds().getSouthWest();
			this.se = this.getBounds().getSouthEast();
			var _this = this;
			if( Object.keys( this.triangles).length > 0){
				return;
			}
			["North", "East", "South", "West"].forEach( function( side ){
				var path = _this._buildSide( side );
				var polygon = L.polygon( path, { 
					title: _this.title,
					color: _this.options.color,
					defColor: _this.options.color,
					fillOpacity:1, 
					stroke:false})
					.addTo(_this._map)
					.on("mouseover", function( e){
						 _this.tooltip.setContent( this.options.title);
						 if( _this._map != null){
							 _this._map.openTooltip( _this.tooltip);
						 }
					})
					.on("mouseout", function(e){
						 if( _this._map != null){
							 _this._map.closeTooltip( _this.tooltip);
						 }
					});
				
				_this.triangles[ side] = polygon;
				
				_this.triangles[ side].feature = { 
						properties: { style: _this.feature.properties.style}
				}
			})

		}
		
	},
	_buildSide( side){
		
		switch( side){
		case "North":
			var latlng0 = this.nw;
			var latlng1 = this.ne;
			var delta = -1;
			break;
		case "South":
			var latlng0 = this.sw;
			var latlng1 = this.se;
			var delta = 1;
			break;
		case "West":
			var latlng0 = this.nw;
			var latlng1 = this.sw;
	
			var delta = -1;
			break;
		case "East":
			var latlng0 = this.ne;
			var latlng1 = this.se;
			var delta = 1;
			break;
		}

		var center = this._map.latLngToLayerPoint( this.centerG);
		var lg = this._map.latLngToLayerPoint( latlng0);

		switch( side ){
		case "North":
		case "South":
			var point = L.point( center.x, lg.y + delta*10);
			break;
		case "West":
		case "East":
			var point = L.point( lg.x + delta *10, center.y);
			break;
		}
		
		var latlng = this._map.layerPointToLatLng( point);
		var path = [latlng0, latlng, latlng1];
		return path;
	},
	onAdd: function(){
		L.Path.prototype.onAdd.call( this);
		if( this.framed){
			if( Object.keys(this.triangles).length < 4){
				return;
			}
			var _this = this;
			["North", "East", "South", "West"].forEach( function( side ){
				if( _this._map)
				 _this.triangles[ side].addTo( _this._map);
			});
		
		}
	},
	/** override onRemove path method **/
	onRemove: function(){
		console.log( "remove");
		if( this.framed){
			var _this = this;
			["North", "East", "South", "West"].forEach( function( side ){
				if( _this._map)
				_this._map.removeLayer( _this.triangles[ side]);
			});
		}
		this._renderer._removePath(this);
	},

	change(){
	
	
		if( this._map && this.framed){
			var _this = this;

			["North", "East", "South", "West"].forEach( function( side ){
				var path = _this._buildSide( side );
				_this.triangles[ side].setLatLngs( path);
			})
			
		}
	},
	select(){
		
		if( !this.options.defColor){
			this.options.defColor = this.options.color;
			
		}
		this.setStyle( { color:"red"});
		if( this.framed ){
			if( Object.keys(this.triangles).length < 4){
				return;
			}
			var _this = this;
			["North", "East", "South", "West"].forEach( function( side ){
			
				_this.triangles[ side ].select();
			})
		}
	
	},
	unselect(){
		if( this.options.defColor){

			this.setStyle( { color:this.options.defColor});
		}
		if( this.framed ){
			if( Object.keys(this.triangles).length < 4){
				return;
			}
			var _this = this;
			["North", "East", "South", "West"].forEach( function( side ){
			
				_this.triangles[ side ].unselect();
			})
		}
	}
})

L.isValidBbox = function( bbox){

	if( bbox.north && bbox.east && bbox.west && bbox.south){
		
		bbox.north = L.modLat(bbox.north);
		bbox.south = L.modLat(bbox.south);
		bbox.east = L.modLng(bbox.east);
		bbox.west = L.modLng(bbox.west);
		if(bbox.east < bbox.west){
				bbox.east +=360;
			
		}
		
		return bbox;
	}else{
		return false;
	}
}
L.isValidBounds =  function( ne, sw ){
	if( Math.abs( ne.lat - sw.lat)>=180 
			|| Math.abs( ne.lng - sw.lng)>=360 || Math.abs( ne.lng)>180 || Math.abs( sw.lng)>180){
		return false;
	}else{
		return true;
	}
}
L.modLat = function( lat ){
	lat = lat%180;
	if( lat > 90 ){
		lat -= 180;
	}else if( lat < -90 ){
		lat += 180;
	}
	return lat;
}
L.modLng = function( lng ){
	lng = lng%360;
	if( lng > 180 ){
		lng -= 360;
	}else if( lng < -180 ){
		lng += 360;
	}
	return lng;
}
L.bbox2bounds = function( bbox ){
   bbox = L.isValidBbox (bbox);

	var ne = [ bbox.north, bbox.east];
	var sw = [ bbox.south, bbox.west];
	return [ne, sw];
}
L.selectedLayer = require("./leaflet.selected-layer.js");

L.selectArea = require("./leaflet.select-area-module.js");
L.Control.groupedLayers = require("./leaflet.layergroup.js");
L.AwesomeMarkers = require("./leaflet.awesome-markers.js");
L.Control.earthLayer = require("./leaflet.earth-layer.js");
//L.FramedLayer = require("./leaflet.framed-layer.js");


module.exports = L;