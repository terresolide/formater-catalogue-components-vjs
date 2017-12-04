L.SelectArea =  L.Class.extend({
	 includes: L.Mixin.Events,
	ne: null,
	sw: null,
	rectangle:null,
	map:null,
	_mode: "hidden",
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
	initialize: function(map, options){
		this.map = map;
		this._setOptions( options );
		this._initListeners();
	    
	},
	_setOptions: function( options ){
		L.Util.setOptions(this, options);
		this.options.markerOptions.color = this.options.color;
		this.options.markerOptions.fill = this.options.color;
		this.options.rectangleOptions.color = this.options.color;
		this.options.rectangleOptions.fill = this.options.color;
	},
	_initListeners(){
		this._areaSelectDrawListener = this._enableSelectArea.bind(this) 
	    document.addEventListener('selectAreaDrawStart', this._areaSelectDrawListener);
	    this._areaSelectDrawEndListener = this._disableSelectArea.bind(this) 
	    document.addEventListener('selectAreaDrawEnd', this._areaSelectDrawEndListener);
	},
	_enableSelectArea: function(e){
		this._showMarkers();
	},
	_disableSelectArea: function(e){
		this._hideMarkers();
	},
	_showMarkers: function(){
		if( !this.rectangle){
			//create rectangle and markers
			this._createGeometries();
		}
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
	_hideMarkers: function(){
		if(this._mode == "show"){
			this.ne.remove();
			this.sw.remove();
			this._mode = "hideMarkers";
		}
	},
	_createGeometries: function(){
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
        
		this.ne = L.circleMarker( ne, this.options.markerOptions);
		this.sw = L.circleMarker( sw, this.options.markerOptions);
		this.rectangle = L.rectangle([ne, sw], this.options.rectangleOptions);
		this._initEventsOnMarkers();
	},
	_dragNE: function(e){
		this.ne.setLatLng(e.latlng);
	},
	_initEventsOnMarkers: function(){
	
		var _map = this.map;
		var _self = this;
		this.ne.on( 'mousedown', function () {
			        var _ne = this;
					function dragNE(e){
						_ne.setLatLng(e.latlng);
						 L.DomEvent.stopPropagation(e);
					    return false;     
					}
				    _map.on('mousemove', dragNE);
				    _map.on("click", function(){
				    	this.off('mousemove', dragNE);
				    });
				});
	}
});
L.selectArea = function(options) {
    return new L.SelectArea(options);
}