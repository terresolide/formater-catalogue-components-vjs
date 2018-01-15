/**
 * Markers Collection ( link to component formater-select with the same name)
 * @class
 * @property {string} name, the same name than the component formater-select
 * @property {listener} allElementsListener, listen to event name + "AllElements" to get informations and create the markers
 * @property {listener} elementsChangeListener, listen click to the select named name, ie name + "ElementsChange"
 * @property {array} markers, array of markers
 * @property {array} bounds, array of location
 * @property {Object} options, for icons
 * @property {L.AwesomeMarkers.icon} iconMarker, the icon for markers
 * @property {L.AwesomeMarkers.icon} iconSelected, the icon for selected markers
 * @emit {Event} SelectMarkerEvent when click on marker with detail={ component: name, value: marker.name}
 */
L.SelectGroup = L.Class.extend({
	name:'',
	allElementsListener:null,
	elementsChangeListener:null,
	markers:[],
	bounds:[],
	map:null,
	options:{
		defaultIcon :{ icon: 'circle', prefix: 'fa', markerColor: 'orange'}, 
	
	},
	iconSelected:null,
	iconMarker:null,
	/**
	 * @constructor
	 * @param {string} name , same name than the select list
	 * @param {L.map} map
	 * @param {Object} options {iconMarker:{ icon, markerColor, prefix},iconSelected:{ icon, markerColor, prefix}}
	 */
	initialize: function( name, map, options ){
		this.name = name;
		this.map = map;
		var iconOptions =  this.options.defaultIcon;
		if( options && options.iconMarker){
			iconOptions = Object.assign( iconOptions ,  options.iconMarker);
		}
		this.iconMarker = new L.AwesomeMarkers.icon( iconOptions);
		
		var iconOptions = { icon: 'circle', prefix: 'fa', markerColor: 'red'};
		if(options && options.iconSelected){
			iconOptions = Object.assign( iconOptions,  options.iconSelected);
		}
		this.iconSelected = new L.AwesomeMarkers.icon( iconOptions);
		
		 this.elementsChangeListener = this.updateMarkers.bind(this) 
	     document.addEventListener(this.name + 'ElementsChange', this.elementsChangeListener);
	     this.allElementsListener = this.addMarkers.bind(this) 
	     document.addEventListener( this.name + 'AllElements' , this.allElementsListener);
	     
	     var event = new CustomEvent( this.name + 'Request', {});
	     document.dispatchEvent(event);
	},
	destroy: function(){
		  for(var key in this.markers){
			  this.map.removeLayer(this.markers[ key]);
			  this.markers[ key ] = null;
		  }
		  document.removeEventListener( this.name +'ElementsChange', this.elementsChangeListener);
	  	  this.elementsChangeListener = null;
	  	  document.removeEventListener( this.name + 'AllElements', this.allElementsListener);
	 	  this.allElementsListener = null;
	},
	searchData:function( marker){
		
	},
	
	addMarkers: function(ev){
		 var componentName = this.name;
		 for(var key in ev.detail){
	           var marker = new L.Marker(
	                 ev.detail[key].location,
	                {icon: this.iconMarker,
	                 name: key,
	                 title: ev.detail[key].title
	                });
	           
	           this.bounds.push( ev.detail[key].location );
	           //search data ??
	           marker.on('click', function( e ){
	       	      var event = new CustomEvent('selectMarkerEvent', { detail:{ component: componentName, value: this.options.name}});
	       	      document.dispatchEvent(event);
	       	        
	       	    })
	       	   
	           marker.addTo( this.map);
	           this.markers[ key] = marker;
	       }
	       this.map.fitBounds( this.bounds);
	},
	updateMarkers: function (ev){
		  var iconSelected = this.iconSelected;
    	   var iconMarker = this.iconMarker;
     	    for(var key in this.markers){
     	    	if( ev.detail && ev.detail[0].indexOf(key)>-1 ){
     	    		this.markers[key].setIcon(iconSelected);
     	    	}else{
     	    		this.markers[key].setIcon(iconMarker);
     	    	}
     	    }
	}
})