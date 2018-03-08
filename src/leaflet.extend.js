/**
 * 
 */
var L = require("leaflet");
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


L.selectArea = require("./leaflet.select-area.js");
L.Control.groupedLayers = require("./leaflet.layergroup.js");




module.exports = L;