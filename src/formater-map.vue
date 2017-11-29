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
          areaselect:null,
          areaSelectDrawListener: null,
          areaSelectDrawEndListener: null
        
  
      }
  },
  methods: {
       enableSelectArea(bbox){
           if(bbox){
               // @todo centre la pour que les bornes soit dedans
               // @todo calcul la taille de la zone à l'écran
           		//this.areaSelect.addTo(this.map);
              // this.map.fitBounds( bounds);
              
           }else{
               //this.areaSelect.addTo(this.map);
           }
           this.areaSelect = L.areaSelect({width:200, height:300});
     	  
    	   this.areaSelect.on( "change", function(){
    	       var bounds = this.getBounds();
    	       var bbox = {
    	               north: bounds.getNorthEast().lat,
    	               east: bounds.getNorthEast().lng,
    	               south: bounds.getSouthWest().lat,
    	               west: bounds.getSouthWest().lng
    	       }
    	       var event = new CustomEvent('selectAreaChange', {detail:{ box : bbox}});
    	       document.dispatchEvent(event);
    	   });
    	   this.areaSelect.addTo(this.map);
           
       },
       disableSelectArea(){
           console.log("disable area");
           this.areaSelect.remove();
         
       },
       
	
	},
	
  created(){
      this.$i18n.locale = this.lang;
      this.areaSelectDrawListener = this.enableSelectArea.bind(this) 
		document.addEventListener('selectAreaDrawStart', this.areaSelectDrawListener);
      this.areaSelectDrawEndListener = this.disableSelectArea.bind(this) 
		document.addEventListener('selectAreaDrawEnd', this.areaSelectDrawEndListener);
    
  },  
  mounted(){
      this.map = L.map(this.$el.querySelector(".formater-map > div"), {selectArea:true}).setView([51.505, -0.09], 3);
	  L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	      attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
	      maxZoom: 18
	  }).addTo( this.map );
	  //plugin areaselect
	 /* this.areaSelect = L.areaSelect({width:200, height:300});
	  
	   this.areaSelect.on( "change", function(){
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
      document.removeEventListener('selectAreaDrawStart', this.areaSelectDrawListener);
		this.areaSelectDrawListener = null;
		document.removeEventListener('selectAreaDrawEnd', this.areaSelectDrawEndListener);
		this.areaSelectDrawEndListener = null;
  }

}

</script>

<style>
[id="formatermap"]{
  width:100%;
  min-height:500px;
}
</style>