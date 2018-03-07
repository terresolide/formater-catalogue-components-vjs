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
import ftMap from "./formater-map.js";

export default {

  props:{
	  
      lang: {
          type: String,
          default: 'fr'
      }
    
  },
  data(){
      return {
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
	      console.log( hw);
// 	      this.height = hw - this.$el.querySelector(".formater-map > div").getBoundingClientRect().top -5;
// 	      this.map._container.style.height = this.height +"px";
// 	      this.$el.querySelector("#formatermap").style.height = Math.round(this.height) + "px";
//this.map.invalidateSize()
	      ftMap.resize(hw);
	  },
	  handleReset(){
		  if( this.observatories){
              this.observatories.remove();
              
          }
	  },
	
	  displayResults( event ){
		  ftMap.displayResults(event);
// 		  this.handleReset();
		  
//           var iconOptions = { icon: 'magnet', prefix: 'fa', markerColor: 'blue'};
//           var iconMarkerIntermagnet= new L.AwesomeMarkers.icon( iconOptions);
//           var iconOptions = { icon: 'magnet', prefix: 'fa', markerColor: 'orange'};
//           var iconMarkerBCMT= new L.AwesomeMarkers.icon( iconOptions);
//           var lang = this.lang;
//           var query = event.detail.query;
          
//           this.observatories = L.geoJSON(event.detail.result, {
//               /*style: function (feature) {
//                   return feature.properties && feature.properties.style;
//               },

//               onEachFeature: onEachFeature,*/

//               pointToLayer: function (feature, latlng) {
//                  // console.log(feature.properties.title[lang]);
//                   if( feature.properties.organism == "INTERMAGNET"){
//                 	  var iconMarker = iconMarkerIntermagnet;
//                 	  var color = "blue";
//                   }else{
//                 	  var iconMarker = iconMarkerBCMT;
//                 	  var color = "orange";
//                   }
//                   var marker = new L.Marker(
//                           latlng,
//                           {icon: iconMarker,
//                            name: feature.properties.identifiers.customId,
//                            title: feature.properties.name[lang],
//                            properties: feature.properties,
//                            color: color,
//                            query: query
//                           });
//                   //marker.createPopup(lang);
//                   //search data??
//                  // var url = "http://formater.art-sciences.fr";
//                   //var url = "http://api.formater"
//                  // 
//                   marker.on('click', function(e ){
//                 	  console.log(query);
//                 	  this.createPopup(lang);
//                 	 // if(_selected == this){
//                 		//  var event = new CustomEvent("unselectLayer", { detail:{}});
//                     	//  document.dispatchEvent(event);
//                 	 // }
//                 	//  _selected = this.toggle( _selected );
//                 	 // console.log( event);
//                       //console.log( this.options.name);
//                   })
//                   return marker;
//               }
//           });
//           this.observatories.addTo( this.map);
//          // this.observatoriesRequest();
//           //event observatories for map
         
      }
  },
  created(){
      this.$i18n.locale = this.lang;
      this.findObservatoriesListener = this.displayResults.bind(this) 
      document.addEventListener('findObservatoriesEvent', this.findObservatoriesListener);
      this.aerisResetListener = this.handleReset.bind(this) 
      document.addEventListener('selectAreaDrawEnd', this.handleReset);
         
  }, 
 
  mounted(){
	  var node = this.$el.querySelector(".formater-map > div");
	  console.log( node);
      ftMap.initialize( node, this.lang);
      this.resize();
	  
//       this.map = L.map(this.$el.querySelector(".formater-map > div"), {selectArea:true}).setView([51.505, -0.09], 3);
// 	  L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
// 	      attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
// 	      maxZoom: 18,
// 	      minZoom:1
// 	  }).addTo( this.map );
// 	  this.map.on( "resize", this.resize);
// 	  this.resize();
	  
// 	  this.selectArea = L.selectArea(
// 			  {
// 				  map:this.map, 
// 				  options:{
// 					  width:400, 
// 					  height:300, 
// 					  color:"#DD9946"
// 				  }});
	  //var observatoriesMarker = new L.MarkersCollection( "observatories", this.map , {iconMarker:{icon:"binoculars"}, iconSelected:{icon:'binoculars'}});
	  //this.getObservatories();
  },
  destroyed(){
	  document.removeEventListener('findObservatoriesEvent', this.findObservatoriesListener);
      this.findObservatoriesListener = null;
      document.removeEventListener('selectAreaDrawEnd', this.aeraResetListener);
      this.areaResetListener = null;
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
#formatermap .leaflet-popup-content h4{
	color: rgb(221, 153,70);
}
#formatermap .leaflet-popup-content input[type="button"]{
	width:280px;
	font-family: "Dejavu serif";
	margin: 0px 0px 3px 7px;
	padding: 3px 12px;
	white-space: normal;
	text-align: center;
	background: #DD9946;
	border-width: 1px;
	border-style: solid;
	border-radius: 1px;
	font-size: 12px;
	font-weight: bold;
	line-height: 1.7;
	border-color: #e5b171 #cb8025 #cb8025;
	color: #fff;
	text-decoration: none;
	text-shadow: 0 -1px 1px #a0651d, 1px 0 1px #cb8025, 0 1px 1px #cb8025, -1px 0 1px #a0651d;
	vertical-align: top;
	cursor: pointer;
	pointer-events: auto;
	box-sizing: border-box;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
	/*border-color: rgb(224, 163, 89) rgb(199, 138, 63) rgb(199, 138, 63);*/
}
#formatermap .leaflet-popup-content input[type="button"]:hover{
	background:#f39b30;
}
#formatermap .leaflet-popup-content input[type="button"].selected{
	
	background: #D53E2A;

	 border-color: #dd6555 #aa3222 #aa3222;

	 text-shadow: 0 -1px 1px #802519, 1px 0 1px #aa3222, 0 1px 1px #aa3222, -1px 0 1px #802519;

	
}
#formatermap .leaflet-popup-content input[type="button"].selected:hover{
  background: #ef2a10;
}
#formatermap .leaflet-popup-content div > div{
	margin-bottom:15px;
}
</style>