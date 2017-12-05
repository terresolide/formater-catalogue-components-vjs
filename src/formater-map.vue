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
          selectArea:null
      }
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

	  this.selectArea = L.selectArea(
			  {
				  map:this.map, 
				  options:{
					  width:400, 
					  height:300, 
					  color:"#DD9946"
				  }});
	  
  },
  destroyed(){
   
  }

}

</script>

<style>
[id="formatermap"]{
  width:100%;
  min-height:500px;
}
</style>