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
	triangles:[],
	framed: false,
	addFramed:function( style){
		console.log( style);
		if( style && style.border == "triangle"){
			this.framed = true;
		
		}
	},
	buildFramed: function(){
		if( ! this.framed ){
			return;
		}

		console.log( "buildFramed");
		if( this._map){
			this.centerG = this.getCenter();
			this.nw = this.getBounds().getNorthWest();
			this.ne = this.getBounds().getNorthEast();
			this.sw = this.getBounds().getSouthWest();
			this.se = this.getBounds().getSouthEast();
			var _this = this;
			["North", "East", "South", "West"].forEach( function( side ){
				var path = _this._buildSide( side );
				var polygon = L.polygon( path, { color: _this.options.color, fillOpacity:1, stroke:false}).addTo(_this._map);
				_this.triangles[ side] = polygon;
			})
//			var center = this._map.latLngToLayerPoint( this.centerG);
//			var top = this._map.latLngToLayerPoint( this.nw);
//            
//			var pointTop = L.point( center.x, top.y - 10);
//			var latlng = this._map.layerPointToLatLng( pointTop);
//			var path = [this.nw, latlng, this.ne];
//
//			var polygon = L.polygon( path, { color: this.options.color, fillOpacity:1, stroke:false}).addTo(this._map);
//			this.triangles[0] = polygon;
			console.log( "passé dans buildFramed");
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
		console.log( "buildside step next" + side);
		var center = this._map.latLngToLayerPoint( this.centerG);
		var lg = this._map.latLngToLayerPoint( latlng0);
		console.log( lg);
		switch( side ){
		case "North":
		case "South":
			var point = L.point( center.x, lg.y + delta*10);
			break;
		case "West":
		case "East":
			console.log( lg.x);
			console.log( delta);
			console.log( lg.x + delta*10);
			var point = L.point( lg.x + delta *10, center.y);
			break;
		}
		console.log( point );
		var latlng = this._map.layerPointToLatLng( point);
		var path = [latlng0, latlng, latlng1];
		return path;
	},
	/** override onRemove path method **/
	onRemove: function(){
		console.log( "remove");
		if( this.framed){
			this._map.removeLayer( this.triangles[0]);
		}
		this._renderer._removePath(this);
	},
	removeListener(){
		//this._map.off( zoomend, update);
		//this.listener = null;
	},
	change(){
	
	
		if( this._map && this.framed){
			var _this = this;
			["North", "East", "South", "West"].forEach( function( side ){
				var path = _this._buildSide( side );
				_this.triangles[ side].setLatLngs( path);
			})
//			
//			var center = this._map.latLngToLayerPoint( this.centerG);
//			var top = this._map.latLngToLayerPoint( this.nw);
//            
//			var pointTop = L.point( center.x, top.y - 10);
//			var latlng = this._map.layerPointToLatLng( pointTop);
//			var path = [this.nw, latlng, this.ne];
//		
//			this.triangles[0].setLatLngs(path);
			
		}
	},
	select(){
		
		if( !this.options.defColor){
			this.options.defColor = this.options.color;
			
		}
		this.setStyle( { color:"red"});
		if( this.framed && this.triangles != "undefined"){
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
		if( this.framed && this.triangles != "undefined"){
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
			|| Math.abs( ne.lng - sw.lng)>=360){
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
L.FramedLayer = require("./leaflet.framed-layer.js");


module.exports = L;