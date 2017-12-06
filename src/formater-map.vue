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
  methods:{
	  resize(){
	      var width = this.$el.querySelector("#formatermap").offsetWidth;
	 
	      var height = width/2;
	  
	      this.map._container.style.height = height +"px";
	      this.$el.querySelector("#formatermap").style.height = Math.round(height) + "px";
	      this.map.invalidateSize()
	  }
  },
  created(){
      this.$i18n.locale = this.lang;
        
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
	  
  },
  destroyed(){
   
  }

}

</script>

<style>
[id="formatermap"]{
  width:100%;
  min-height:461px;
}
</style>