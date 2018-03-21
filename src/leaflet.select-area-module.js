/**
 * select area layer using leaflet
 * @author epointal
 * @licence gnu
 * @version 1.2
 * 
 */

/**
 * compute if bbox is valid
 * @param {object} bbox ie {north, east, south, west}
 * @return bbox| false
 */

/**
 * Select area layer
 * @class
 * @property {L.CircleMarker} ne North East Marker
 * @property {L.CircleMarker} sw South West Marker
 * @property {L.Rectangle} rectangle the geometric area
 * @property {L.Map} map the map where is draw the rectangle...
 * @property {object} options color, width, opacity....
 * 
 * @listen "selectAreaDrawStart" then display markers NE and SW with positions in bbox event.detail
 * @listen "selectAreaDrawEnd" then hide markers NE and SW and change position with position in bbox event.detail
 * @emit "selectAreaChange" when select area change with event.detail equal bbox
 */
L.SelectArea =   L.Evented.extend({
	ne: null,
	sw: null,
	rectangle:null,
	map:null,
	options:{
		width:400,
		height:300,
		color:  "#ff7800",
		markerOptions:{
			radius:7,
			fillOpacity: 0.8,
			draggable: true
		},
		rectangleOptions:{
			fillOpacity: 0.2
		}
	},
	_mode: "hidden",
	/**
	 * @constructor
	 * @param {object} prop essentially the map
	 *   example :{ map: a_map,
	 *   			options:{
	 *   				width:400,
	 *   				height:300,
	 *   				color: "blue"
	 *   			}
	 *   		  }

	 */
	initialize: function(prop){
		this.map = prop.map;
		this.setOptions( prop.options );
		this._initListeners();
		this.on("change", function(){
            var bounds = this.rectangle.getBounds();
            var bbox = {
                    north: L.modLat( bounds.getNorthEast().lat),
                    east: L.modLng(bounds.getNorthEast().lng),
                    south: L.modLat(bounds.getSouthWest().lat),
                    west: L.modLng(bounds.getSouthWest().lng)
            }
        
            var event = new CustomEvent('selectAreaChange', {detail:bbox});
            document.dispatchEvent(event);
        });
	    
	},
	/**
	 * change select area position with values in array bounds
	 * @param {Array} bounds array of latlng bounds [ne, sw]
	 */
	setBounds: function( bounds){
		
		var ne = bounds[0];
		var sw = bounds[1];
		if( !this.ne){
			return;
		}
		this.ne.setLatLng(ne);
		this.sw.setLatLng(sw);
		this.rectangle.setBounds( bounds);
		
		
	},
	
	setOptions: function( options ){
		L.Util.setOptions(this, options);
		this.options.markerOptions.color = this.options.color;
		this.options.markerOptions.fill = this.options.color;
		this.options.rectangleOptions.color = this.options.color;
		this.options.rectangleOptions.fill = this.options.color;
	},
	setColor( color ){
		if( this.rectangle){
			this.rectangle.setStyle({color:color, fill:color});
		}
		if( this.ne){
			this.ne.setStyle({color:color, fill:color});
		}
		if( this.sw){
			this.sw.setStyle({color:color, fill:color});
		}
	},
	initColor(){
		if( this.rectangle){
			this.rectangle.setStyle({
				color: this.options.rectangleOptions.color, 
				fill:this.options.rectangleOptions.fill
				});
		}
		if( this.ne){
			this.ne.setStyle({
				color: this.options.markerOptions.color, 
				fill: this.options.markerOptions.fill
			});
		}
		if( this.sw){
			this.sw.setStyle({
				color: this.options.markerOptions.color, 
				fill: this.options.markerOptions.fill
			});
		}
	},
	_initListeners(){
		this._areaSelectDrawListener = this._enableSelectArea.bind(this) 
	    document.addEventListener('selectAreaDrawStart', this._areaSelectDrawListener);
	    this._areaSelectDrawEndListener = this._disableSelectArea.bind(this) 
	    document.addEventListener('selectAreaDrawEnd', this._areaSelectDrawEndListener);
	},
	_enableSelectArea: function(e){
		this._showMarkers( e );
	},
	_disableSelectArea: function(e){
		this._hideMarkers(e );
		if(this.rectangle)
		this.map.fitBounds( this.rectangle.getBounds());
	},
	_showMarkers: function(e){
		
		var bounds = this._createBounds(e.detail)
		if( !this.rectangle){
			//create rectangle and markers
			this._createGeometries( bounds);
		}else{
		
			this.setBounds( bounds);
		}
		this.fire("change");
		switch( this._mode){
		case "hidden":
			this.rectangle.addTo( this.map );
		case "hideMarkers":
			this.ne.addTo( this.map );
			this.sw.addTo( this.map );
			break;
		}
		this._mode = "show";
		
	},
	_hideMarkers: function(evt){
		
		if(this._mode == "show"){
			this.ne.remove();
			this.sw.remove();
			//if dragging marker
			this.map.fire("click");
			this._mode = "hideMarkers";
			
		}
		var bounds = this._createBounds(evt.detail);
		this.setBounds(bounds);
		
		if( !evt.detail.north ){
			if( this.rectangle)
			this.rectangle.remove();
			this._mode = "hidden";
		}
	},
	_createBounds: function(bbox){
		bbox = L.isValidBbox( bbox);
		if( bbox ){
			var bounds = L.bbox2bounds( bbox);
		}else{
			
			var size = this.map.getSize();
	        var topRight = new L.Point();
	        var bottomLeft = new L.Point();
	        size.x = this.map._container.offsetWidth;
	        bottomLeft.x = Math.round((size.x - this.options.width) / 2);
	        topRight.y = Math.round((size.y - this.options.height) / 2);
	        topRight.x = size.x - bottomLeft.x;
	        bottomLeft.y = size.y - topRight.y;
	        
	        var sw = this.map.containerPointToLatLng(bottomLeft);
	        var ne = this.map.containerPointToLatLng(topRight);
	        var bounds = [ne, sw];
		}
		
		return bounds;
	},
	_createGeometries: function( bounds){
		var ne = bounds[0];
		var sw = bounds[1];
		if(!L.isValidBounds(ne, sw )){
			//case bounds are invalid because of lng
			if(Math.abs(ne.lng)> 180){
				ne.lng = 180;
			}
			if(Math.abs(sw.lng)>180){
				sw.lng = -180;
			}
			
		}
		this.ne = L.circleMarker( ne, this.options.markerOptions);
		this.sw = L.circleMarker( sw, this.options.markerOptions);
		this.rectangle = L.rectangle( bounds , this.options.rectangleOptions);
		this.map.fitBounds( bounds);
		this._initEventsOnMarkers();
		this.fire("change");
	},

	_initEventOnMarker: function( marker , callback ){
		var _map = this.map;
		var _self = this;
		marker.on( 'mousedown', function () {
	        
	        _map.dragging.disable();
			_self.setColor( "#ff0000");
		    _map.on('mousemove', callback);
		    _map.on("click", function(){
		    	this.off('mousemove', callback);
		    	this.dragging.enable();
		    	_self.initColor();
		    });
		});
	},

	_initEventsOnMarkers: function(){
		var _ne = this.ne;
		var _sw = this.sw;
		var _area = this.rectangle;
		var _self = this;
		function dragNE(e){
			if( L.isValidBounds( e.latlng, _sw.getLatLng())){
				_self.ne.setLatLng(e.latlng);   
				_self.rectangle.setBounds([
					_self.ne.getLatLng(),
					_self.sw.getLatLng()]);
				_self.fire("change");
			}
		}
		function dragSW(e){
			if( L.isValidBounds( e.latlng, _ne.getLatLng())){
				_self.sw.setLatLng(e.latlng);   
				_self.rectangle.setBounds([
					_self.ne.getLatLng(),
					_self.sw.getLatLng()]);
				_self.fire("change");
			}
		}
		
		this._initEventOnMarker( _ne, dragNE);
		this._initEventOnMarker( _sw, dragSW)
		
	}
});
L.selectArea = function(options) {
    return new L.SelectArea(options);
}
module.exports = L.selectArea;