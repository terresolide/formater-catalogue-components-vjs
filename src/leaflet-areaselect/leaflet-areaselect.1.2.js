/** git test what name is used global git config???*/
L.AreaSelect = L.Class.extend({
    includes: L.Mixin.Events,
   // includes: L.Evented,
    options: {
        width: 400,
        height: 300,
        keepAspectRatio: false,
    },

    initialize: function(map,options) {
        this.map = map;
        L.Util.setOptions(this, options);
        
        this._width = this.options.width;
        this._height = this.options.height;
        this._areaSelectDrawListener = this._enableSelectArea.bind(this) 
        document.addEventListener('selectAreaDrawStart', this._areaSelectDrawListener);
        this._areaSelectDrawEndListener = this._disableSelectArea.bind(this) 
        document.addEventListener('selectAreaDrawEnd', this._areaSelectDrawEndListener);
        this.on( "change", function(){
            var bounds = this.getBounds();
            var bbox = {
                    north: bounds.getNorthEast().lat%90,
                    east: bounds.getNorthEast().lng%180,
                    south: bounds.getSouthWest().lat%90,
                    west: bounds.getSouthWest().lng%180
            }
            var event = new CustomEvent('selectAreaChange', {detail:{ box : bbox}});
            document.dispatchEvent(event);
        });
 
    },
    
    display: function() {
    	this.shutdown = false;
        //this.map = map;
    	if(!this._container){
            this._createElements();
            this._render();
    	}
    	this._container.style.display = "block";
    	this.fire("change");
        return this;
    },
    
    getBounds: function() {
        var size = this.map.getSize();
        var topRight = new L.Point();
        var bottomLeft = new L.Point();
        size.x = this.map._container.offsetWidth;
        bottomLeft.x = Math.round((size.x - this._width) / 2);
        topRight.y = Math.round((size.y - this._height) / 2);
        topRight.x = size.x - bottomLeft.x;
        bottomLeft.y = size.y - topRight.y;
        
        var sw = this.map.containerPointToLatLng(bottomLeft);
        var ne = this.map.containerPointToLatLng(topRight);
        
        return new L.LatLngBounds(sw, ne);
    },
    
    hide: function() {
        this.shutdown = true;
        this._container.style.display = "none";
    },

    
    setDimensions: function(dimensions) {
        if (!dimensions)
            return;

       // this._height = parseInt(dimensions.height) || this._height;
      //  this._width = parseInt(dimensions.width) || this._width;
        this._render();
        this.fire("change");
    },

    _enableSelectArea: function(e ){
        console.log("enableSelectArea");
        if(e.detail.north){
            var bbox = e.detail;
           if(bbox.east < bbox.west){
               bbox.west -=180;
           }
           var ne = L.latLng([bbox.north, bbox.east]);
           var sw = L.latLng([bbox.south, bbox.west] );
           var bounds = [ne, sw];
          this.latLngBounds = bounds;
	
	if(this.diffBounds){
           this.map.fitBounds(bounds, { maxZoom:18});
	}else{
	   this._onFitBounds();
	}
          /* var topright = this.map.project(ne, this.map.getZoom());
           var diff = this.map.project(sw, this.map.getZoom()).subtract( topright);
           
           //compute size width and height
           
           this._width = Math.abs( diff.x);
           this._height = Math.abs( diff.y);*/
        }else{
            //this.areaSelect.addTo(this.map);
            this._width = 400;
            this._height = 300;
 if(this.area){
            // this.area.setBounds([]);
             this.area.remove();
         }
        // this.setDimensions({width:width, height:height})
       //  this.areaSelect = L.areaSelect({width:width, height:height});
        
        
         this.display();
           
        }
       
       
        
    },
    _disableSelectArea(e){
        //create rectangle on map
        if( e.detail.north && e.detail.south && e.detail.east && e.detail.west){
            var bbox = e.detail;
            if(bbox.east < bbox.west){
               bbox.west -=180;
            }
            var ne = L.latLng([bbox.north, bbox.east]);
            var sw = L.latLng([bbox.south, bbox.west] );
            var bounds = [ne, sw];
            if( this.area){
                this.area.setBounds(bounds);
            }else{
                this.area = L.rectangle(bounds, {color: "#ff7800", weight: 1});
            }
            this.area.addTo(this.map);
        }else{
            if(this.area){
                this.area.remove();
            }
        }
        
        this.hide();
    },
    _createElements: function() {
        if (!!this._container)
            return;
        
        this._container = L.DomUtil.create("div", "leaflet-areaselect-container", this.map._controlContainer)
        this._topShade = L.DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        this._bottomShade = L.DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        this._leftShade = L.DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        this._rightShade = L.DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        
        this._nwHandle = L.DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        this._swHandle = L.DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        this._neHandle = L.DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        this._seHandle = L.DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        
        this._setUpHandlerEvents(this._nwHandle);
        this._setUpHandlerEvents(this._neHandle, -1, 1);
        this._setUpHandlerEvents(this._swHandle, 1, -1);
        this._setUpHandlerEvents(this._seHandle, -1, -1);
        
        this.map.on("moveend", this._onMapChange, this);
        this.map.on("zoomend", this._onMapChange, this);
        this.map.on("resize", this._onMapResize, this);
        this.map.on("moveend zoomend", this._onFitBounds());
        
    },
    
    _setUpHandlerEvents: function(handle, xMod, yMod) {
        xMod = xMod || 1;
        yMod = yMod || 1;
        
        var self = this;
        function onMouseDown(event) {
            event.stopPropagation();
            self.map.dragging.disable();
            L.DomEvent.removeListener(this, "mousedown", onMouseDown);
            var curX = event.pageX;
            var curY = event.pageY;
            var ratio = self._width / self._height;
            var size = self.map.getSize();
            size.x = self.map._container.offsetWidth;
            function onMouseMove(event) {
                if (self.options.keepAspectRatio) {
                    var maxHeight = (self._height >= self._width ? size.y : size.y * (1/ratio) ) - 30;
                    self._height += (curY - event.originalEvent.pageY) * 2 * yMod;
                    self._height = Math.max(30, self._height);
                    self._height = Math.min(maxHeight, self._height);
                    self._width = self._height * ratio;
                } else {
                    self._width += (curX - event.originalEvent.pageX) * 2 * xMod;
                    self._height += (curY - event.originalEvent.pageY) * 2 * yMod;
                    self._width = Math.max(30, self._width);
                    self._height = Math.max(30, self._height);
                    self._width = Math.min(size.x-30, self._width);
                    self._height = Math.min(size.y-30, self._height);
                    
                }
                
                curX = event.originalEvent.pageX;
                curY = event.originalEvent.pageY;
                self._render();
            }
            function onMouseUp(event) {
                self.map.dragging.enable();
                L.DomEvent.removeListener(self.map, "mouseup", onMouseUp);
                L.DomEvent.removeListener(self.map, "mousemove", onMouseMove);
                L.DomEvent.addListener(handle, "mousedown", onMouseDown);
                self.fire("change");
            }
            
            L.DomEvent.addListener(self.map, "mousemove", onMouseMove);
            L.DomEvent.addListener(self.map, "mouseup", onMouseUp);
        }
        L.DomEvent.addListener(handle, "mousedown", onMouseDown);
    },
    _onFitBounds: function(){
	if(!this.shutdown) return;
	if(this.latLngBounds){
	 var topright = this.map.project(this.latLngBounds[0], this.map.getZoom());
	var diff = this.map.project( this.latLngBounds[1], this.map.getZoom()).subtract( topright);
		   
	//compute size width and height
	 this._width = Math.abs( diff.x);
	 this._height = Math.abs( diff.y);
	}
	if(this.area){
            // this.area.setBounds([]);
             this.area.remove();
         }
        // this.setDimensions({width:width, height:height})
       //  this.areaSelect = L.areaSelect({width:width, height:height});
        console.log("on fit bounds");
        
         this.display();
    },
    
    _onMapResize: function() {
        if(this.shutdown){
	this.diffBounds = true;
            return;
        }
        this._render();
    },
    
    _onMapChange: function() {
        if(this.shutdown){
this.diffBounds = true;
            return;
        }
        this.fire("change");
    },
    
    _render: function() {
        var size = this.map.getSize();
        console.log("size = "+size.x);
        console.log(this.map._container.offsetWidth);
        size.x = this.map._container.offsetWidth;
        var handleOffset = Math.round(this._nwHandle.offsetWidth/2);
        console.log("nwHandle =" + this._nwHandle.offsetWidth);
        var topBottomHeight = Math.round((size.y-this._height)/2);
        var leftRightWidth = Math.round((size.x-this._width)/2);
        console.log("width = " + this._width);
        
        function setDimensions(element, dimension) {
            element.style.width = dimension.width + "px";
            element.style.height = dimension.height + "px";
            element.style.top = dimension.top + "px";
            element.style.left = dimension.left + "px";
            element.style.bottom = dimension.bottom + "px";
            element.style.right = dimension.right + "px";
        }
        
        setDimensions(this._topShade, {width:size.x, height:topBottomHeight, top:0, left:0});
        setDimensions(this._bottomShade, {width:size.x, height:topBottomHeight, bottom:0, left:0});
        setDimensions(this._leftShade, {
            width: leftRightWidth, 
            height: size.y-(topBottomHeight*2), 
            top: topBottomHeight, 
            left: 0
        });
        setDimensions(this._rightShade, {
            width: leftRightWidth, 
            height: size.y-(topBottomHeight*2), 
            top: topBottomHeight, 
            right: 0
        });
        
        setDimensions(this._nwHandle, {left:leftRightWidth-handleOffset, top:topBottomHeight-7});
        setDimensions(this._neHandle, {right:leftRightWidth-handleOffset, top:topBottomHeight-7});
        setDimensions(this._swHandle, {left:leftRightWidth-handleOffset, bottom:topBottomHeight-7});
        setDimensions(this._seHandle, {right:leftRightWidth-handleOffset, bottom:topBottomHeight-7});
    }
});

L.areaSelect = function(options) {
    return new L.AreaSelect(options);
}
