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


//var L.AreaSelect= require( 'leaflet-areaselect/leaflet-areaselect.1.0.js');
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
          areaselect:null,
          areaSelectDrawListener: null,
          areaSelectDrawEndListener: null
        
  
      }
  },
  methods: {
     /*  enableSelectArea( e ){
          
       },
      /* disableSelectArea(e){
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
           }
           this.areaSelect.remove();
           this.areaSelect = null;
         
       },
       */
	
	},
	
  created(){
      this.$i18n.locale = this.lang;
        
  },  
  mounted(){
      this.map = L.map(this.$el.querySelector(".formater-map > div"), {selectArea:true}).setView([51.505, -0.09], 3);
	  L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	      attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
	      maxZoom: 18
	  }).addTo( this.map );
	  //plugin areaselect
	  this.areaSelect = L.selectArea(this.map, {width:400, height:300, color:"red"});
	  
	  /* this.areaSelect.on( "change", function(){
	       var bounds = this.getBounds();
	       var bbox = {
	               north: bounds.getNorthEast().lat,
	               east: bounds.getNorthEast().lng,
	               south: bounds.getSouthWest().lat,
	               west: bounds.getSouthWest().lng
	       }
	       var event = new CustomEvent('selectAreaChange', {detail:{ box : bbox}});
	       document.dispatchEvent(event);
	   })*/
	//plugin location filter
	//this.areaselect = new L.LocationFilter().addTo(this.map);
	
	//plugin area-select
	//this.map.selectArea.enable();
	//console.log( this.map.selectArea);
	//  var event = new CustomEvent('observatoriesRequest', {});
    //  document.dispatchEvent(event);
  },
  destroyed(){
     // document.removeEventListener('selectAreaDrawStart', this.areaSelectDrawListener);
	//	this.areaSelectDrawListener = null;
	//	document.removeEventListener('selectAreaDrawEnd', this.areaSelectDrawEndListener);
	//	this.areaSelectDrawEndListener = null;
  }

}

</script>

<style>
[id="formatermap"]{
  width:100%;
  min-height:500px;
}
</style>