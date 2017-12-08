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

	</div>
</template>



<script>

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
      }
  },
  methods:{
	  resize(){
	      var width = this.$el.querySelector("#formatermap").offsetWidth;
	 
	      var height = width/2;
	  
	      this.map._container.style.height = height +"px";
	      this.$el.querySelector("#formatermap").style.height = Math.round(height) + "px";
	      this.map.invalidateSize()
	  },
	  handleReset(){
		  if( this.observatories){
              this.observatories.remove();
              
          }
	  },
	  displayResults( event ){
		  this.handleReset();
		  
          var iconOptions = { icon: 'magnet', prefix: 'fa', markerColor: 'red'};
          var iconMarker = new L.AwesomeMarkers.icon( iconOptions);
          var lang = this.lang;
          this.observatories = L.geoJSON(event.detail, {
              /*style: function (feature) {
                  return feature.properties && feature.properties.style;
              },

              onEachFeature: onEachFeature,*/

              pointToLayer: function (feature, latlng) {
                  console.log(feature.properties.name[lang]);
                  var marker = new L.Marker(
                          latlng,
                          {icon: iconMarker,
                           name: feature.properties.code,
                           title: feature.properties.name[lang]
                          });
                  marker.on('click', function(e ){
                	  var event = new CustomEvent("", { detail:this});
                	  document.dispatchEvent(event);
                      console.log( this.options.name);
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
      document.addEventListener('aerisResetEvent', this.fhandleReset);
         
  }, 
 
  mounted(){
	  //compute size of map
	
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
      document.removeEventListener('aerisResetEvent', this.handleReset);
      this.handleReset = null;
  }

}

</script>

<style>
[id="formatermap"]{
  width:100%;
  min-height:461px;
}
</style>