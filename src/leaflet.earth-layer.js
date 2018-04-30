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
    title: 'Données globales',
    name: 'Terre entière',
    query:null
    },

  initialize: function( selected, options) {
	  //cross reference between selected-layer and earth-layer
	  this._selected = selected;
	  this._selected.earthControl = this;
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
  getContent(){
	  return this._container;
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

    var link = this._layersLink = L.DomUtil.create('a', className + '-toggle fa fa-globe', container);
    link.href = '#';
    link.title = this.options.name;

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
     


    container.appendChild(form);
    this._container = container;
    return container;
  },

  addObservations: function ( observations, query ){
	  this.options.query = query;
	  this._observations = observations;
	  this._update();
    
  },
 /* isInTemporal( obs, start, end){
	  		var obsStart = obs.temporalExtents.start;
	  		var obsEnd = obs.temporalExtents.end;
	  		if( obsEnd == "now"){
	  			obsEnd = moment().format("YYYY-MM-DD");
	  		}
	  		if( obs.dataLastUpdate && obs.dataLastUpdate < obsEnd){
	  			obsEnd = obs.dataLastUpdate;
	  		}
	  		if( start > obsEnd){
	  			obs.inTemporal = false;
	  			return false;
	  		}
	  		if( end < obsStart ){
	  			obs.inTemporal = false;
	  			return false;
	  		}
	  		obs.inTemporal = true;
	  		return true;
	  	},*/
  	updateObservations( observations, query){
  		this.options.query.start = query.start;
  		this.options.query.end = query.end;
  		this._observations = observations;
  		//this._updateButtons();
  		
  	},
  _toggle: function(){
		if( this._container.className.indexOf('leaflet-control-earth-expanded')>=0){
			this._collapse();
		}else{
			this._expand();
		}
  },
//  _updateButtons: function(){
//	  var form = this._form;
//	  this._observations.forEach( function( obs, index){
//		  var node = form.querySelector('input[data-index="'+ index +'"]');
//		  console.log( node);
//	  });
//  },
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
    if( this._observations.length>0 ){
    	if( this._container.className.indexOf('has-content')<0)
    	this._container.className = this._container.className + " has-content";
    }else{
    	 this._container.className = this._container.className.replace(' has-content', '');
    }
    var count = 0;
    this._observations.forEach( function( obs, index){
    	var input = document.createElement("input");
		input.setAttribute("type", "button");
		input.setAttribute( "value", obs.title[ lang]);
		input.setAttribute("data-index", index);

		if( !obs.inTemporal){
			input.setAttribute("class", "ft-empty");
		}else{
			count++;
		}
		//@todo cds devrait être dans observation en retour ou calculer à partir de obs.formaterDataCenter.code 
		//ou obs.formaterDataCenter.name
		input.setAttribute("data-cds", "isgi");
		form.appendChild( input);
	
		input.addEventListener("click", function(){
			_selected.change(this, _layer);
		});
	
    })

    if( count == 1 ){
    	this._container.className = this._container.className + " ft-empty";
    }else{
    	this._container.className = this._container.className.replace(' ft-empty', '');
    }
  },


  _expand: function () {
    L.DomUtil.addClass(this._container, 'leaflet-control-earth-expanded');
    this._map.closePopup();
    // permits to have a scrollbar if overlays heighter than the map.
    var acceptableHeight = this._map._size.y - (this._container.offsetTop );
    if (acceptableHeight < this._form.clientHeight) {
      L.DomUtil.addClass(this._form, 'leaflet-control-layers-scrollbar');
      this._form.style.height = acceptableHeight + 'px';
    }
    //open first sheet
    var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
    var node = this._form.querySelector("input");
    console.log(node);
	node.dispatchEvent(evt);
  },

  _collapse: function () {
    this._selected.close();
    this._container.className = this._container.className.replace(' leaflet-control-earth-expanded', '');
  },

 
});

L.control.earthLayer = function ( selected, options) {
  return new L.Control.EarthLayer( selected, options);
};

module.exports = L.control.earthLayer;
