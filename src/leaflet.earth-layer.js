/**
 * 
 */
/* global L */

// A layer control which provides for layer groupings.

L.Control.EarthLayer = L.Control.extend({
  _container: null,

  options: {
    collapsed:true,
    position: 'topleft',
    lang: 'fr',
    properties:[],
    title: 'Données globales'
  },

  initialize: function (_selected,options) {
	  console.log( "initialize earth");
	  this._selected = _selected;
	  L.Util.setOptions(this, options);
      
	    this._observations = [];
	    
  },

  onAdd: function (map) {
	this._map = map;
    this._initLayout();
    this._update();

   

    return this._container;
  },

  onRemove: function (map) {
    map
        .off('layeradd', this._onLayerChange, this)
        .off('layerremove', this._onLayerChange, this);
  },
  reset(){
	  this._observations = [];
	  this._update();
  },

  select: function(){
	  this._container.className = this._container.className +" selected";
  },
  unselect: function(){
	  this._container.className = this._container.className.replace(' selected', '');
  },
  _initLayout: function () {
    var className = 'leaflet-control-earth',
   // var className = 'leaflet-control-layers',
      container = this._container = L.DomUtil.create('div', className);
    container.setAttribute('aria-haspopup', true);
    
    L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
  
    var form = this._form = L.DomUtil.create('form', className + '-list');

    
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation);

      var form = this._form = L.DomUtil.create('form', className + '-list');

      if (this.options.collapsed) {

        var link = this._layersLink = L.DomUtil.create('a', className + '-toggle fa fa-globe', container);
        link.href = '#';
        link.title = 'Earth';

        //add title
        var span = L.DomUtil.create("h4", "leaflet-earth-popup-title", container );
        span.innerHTML = this.options.title;
          L.DomEvent
              .on(link, 'click', L.DomEvent.stop)
              .on(link, 'click', this._toggle, this);
   
        // add close button
        var a = L.DomUtil.create('a', 'leaflet-popup-close-button', container);
        a.innerHTML = 'x';
        L.DomEvent.on( a, 'click', this._toggle, this);
        
        this._map.on('click', this._collapse, this);
        // TODO keyboard accessibility
      } else {
        this._expand();
      }


    container.appendChild(form);
    this._container = container;
    return container;
  },

  addObservations: function ( observations) {
	  this._observations = observations;
	  this._update();
    
  },
_toggle: function(){
	if( this._container.className.indexOf('leaflet-control-earth-expanded')>=0){
		this._collapse();
	}else{
		this._expand();
	}
},
  _update: function () {
    if (!this._container) {
      return;
    }
    this.options.properties.observations = this._observations;
    this._form.innerHTML ="";
    var form = this._form;
    var lang = this.options.lang;
    var _selected = this._selected;
   
    var _layer = this;
    this._observations.forEach( function( obs, index){
    	var input = document.createElement("input");
		input.setAttribute("type", "button");
		input.setAttribute( "value", obs.title[ lang]);
		input.setAttribute("data-index", index);
		
		form.appendChild( input);
	
		input.addEventListener("click", function(){
			_selected.change(this, _layer);
	});
    })

  
  },


  _expand: function () {
    L.DomUtil.addClass(this._container, 'leaflet-control-earth-expanded');
    this._map.closePopup();
    // permits to have a scrollbar if overlays heighter than the map.
    var acceptableHeight = this._map._size.y - (this._container.offsetTop );
    console.log( "height form = "+this._form.clientHeight);
    console.log( "acceptableHeight="+acceptableHeight);
    if (acceptableHeight < this._form.clientHeight) {
      L.DomUtil.addClass(this._form, 'leaflet-control-layers-scrollbar');
      this._form.style.height = acceptableHeight + 'px';
    }
  },

  _collapse: function () {
    this._container.className = this._container.className.replace(' leaflet-control-earth-expanded', '');
  },

 
});

L.control.earthLayer = function ( options) {
  return new L.Control.EarthLayer(options);
};

module.exports = L.Control.earthLayer;
