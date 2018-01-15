<i18n>
{
   "en":{
      
   },
   "fr":{
       
   }
}
</i18n>

<template>	
	<div class="formater-map">
	    <div id="formatermap" ></div>
	    <formater-sheet :lang="lang" :maxheight="height-60"></formater-sheet>
	</div>
</template>



<script>
/*const L.Marker.DONE = 1;
const L.Marker.WAITING = 2;
const L.Marker.TODO = 0;
const L.Marker.ERROR = 3;*/
var _selected = null;
export default {

  props:{
	  
      lang: {
          type: String,
          default: 'fr'
      }
    
  },
  data(){
      return {
          map:null,
          selectArea:null,
          observatories:null,
          findObservatoriesListener:null,
          closeSheetListener: null,
          height: 600,
          selected: null
      }
  },
  methods:{
	  resize(){
	      var hw = window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight; 
	      this.height = hw - this.$el.querySelector(".formater-map > div").getBoundingClientRect().top -5;
	      this.map._container.style.height = this.height +"px";
	      this.$el.querySelector("#formatermap").style.height = Math.round(this.height) + "px";
	      this.map.invalidateSize()
	  },
	  handleReset(){
		  if( this.observatories){
              this.observatories.remove();
              
          }
	  },
	  unselectLayer(){
		 // console.log("unselect");
		  if( _selected)
		  _selected.fire('click');
	  },
	  displayResults( event ){
		  this.handleReset();
		  
          var iconOptions = { icon: 'magnet', prefix: 'fa', markerColor: 'blue'};
          var iconMarkerIntermagnet= new L.AwesomeMarkers.icon( iconOptions);
          var iconOptions = { icon: 'magnet', prefix: 'fa', markerColor: 'orange'};
          var iconMarkerBCMT= new L.AwesomeMarkers.icon( iconOptions);
          var lang = this.lang;
          var query = event.detail.query;
          
          this.observatories = L.geoJSON(event.detail.result, {
              /*style: function (feature) {
                  return feature.properties && feature.properties.style;
              },

              onEachFeature: onEachFeature,*/

              pointToLayer: function (feature, latlng) {
                 // console.log(feature.properties.title[lang]);
                  if( feature.properties.organism == "INTERMAGNET"){
                	  var iconMarker = iconMarkerIntermagnet;
                	  var color = "blue";
                  }else{
                	  var iconMarker = iconMarkerBCMT;
                	  var color = "orange";
                  }
                  var marker = new L.Marker(
                          latlng,
                          {icon: iconMarker,
                           name: feature.properties.code,
                           title: feature.properties.title[lang],
                           data: feature.properties,
                           color: color
                          });
                  //search data??
                  var url = "http://formater.art-sciences.fr";
                  //var url = "http://api.formater"
                 // 
                  marker.on('click', function(e ){
                	  console.log(query);
                	  if(_selected == this){
                		  var event = new CustomEvent("unselectLayer", { detail:{}});
                    	  document.dispatchEvent(event);
                	  }else{
                	   	this.searchData( url, query);
                	  
                	  
                	  var event = new CustomEvent("displayInfo", { detail:{marker:this, query:query}});
                	  document.dispatchEvent(event);
                	  }
                	  _selected = this.toggle( _selected );
                	 // console.log( event);
                      //console.log( this.options.name);
                  })
                  return marker;
              }
          });
          this.observatories.addTo( this.map);
         // this.observatoriesRequest();
          //event observatories for map
         
      }
  },
  created(){
      this.$i18n.locale = this.lang;
      this.findObservatoriesListener = this.displayResults.bind(this) 
      document.addEventListener('findObservatoriesEvent', this.findObservatoriesListener);
      this.aerisResetListener = this.handleReset.bind(this) 
      document.addEventListener('selectAreaDrawEnd', this.handleReset);
      this.closeSheetListener = this.unselectLayer.bind(this) 
      document.addEventListener('closeSheet', this.closeSheetListener);
         
  }, 
 
  mounted(){

	  
      this.map = L.map(this.$el.querySelector(".formater-map > div"), {selectArea:true}).setView([51.505, -0.09], 3);
	  L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	      attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
	      maxZoom: 18,
	      minZoom:1
	  }).addTo( this.map );
	  this.map.on( "resize", this.resize);
	  this.resize();
	  
	  this.selectArea = L.selectArea(
			  {
				  map:this.map, 
				  options:{
					  width:400, 
					  height:300, 
					  color:"#DD9946"
				  }});
	  //var observatoriesMarker = new L.MarkersCollection( "observatories", this.map , {iconMarker:{icon:"binoculars"}, iconSelected:{icon:'binoculars'}});
	  //this.getObservatories();
  },
  destroyed(){
	  document.removeEventListener('findObservatoriesEvent', this.findObservatoriesListener);
      this.findObservatoriesListener = null;
      document.removeEventListener('selectAreaDrawEnd', this.aeraResetListener);
      this.areaResetListener = null;
      document.removeEventListener('closeSheet', this.closeSheetListener);
      this.closeSheetListener = null;
  }

}

</script>

<style>
.formater-map{
    position:relative;
    overflow:hidden;
}
[id="formatermap"]{
  width:100%;
  min-height:300px;
}
</style>