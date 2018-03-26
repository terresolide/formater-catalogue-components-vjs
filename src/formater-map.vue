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

var L = require('./leaflet.extend.js');
import FtMap from "./formater-map.js";
var ftMap = new FtMap(L);

export default {

  props:{
	  
      lang: {
          type: String,
          default: 'fr'
      }
    
  },
  data(){
      return {

          findFeatureListener:null,
          closeSheetListener: null,
          resizeListener:null,
          height: 600,
          selected: null
      }
  },
  methods:{
	  resize(){
	      var hw = window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight;
	      this.height = hw -50 ;//- this.$el.querySelector(".formater-map > div").getBoundingClientRect().top -5;
	      ftMap.resize( this.height);
	  },
	  handleReset(){
		  ftMap.handleReset();
	  },
	
	  displayResults( event ){
		  ftMap.displayResults(event);

         
      }
  },
  created(){
      this.$i18n.locale = this.lang;
      this.findFeatureListener = this.displayResults.bind(this) 
      document.addEventListener('findFeatureEvent', this.findFeatureListener);
      this.aerisResetListener = this.handleReset.bind(this) ;
      document.addEventListener('selectAreaDrawEnd', this.handleReset);
      this.aerisResetListener = this.handleReset.bind(this) ;
      document.addEventListener('aerisSearchEvent', this.handleReset);
      
  	this.resizeListener = this.resize.bind(this);
	window.addEventListener("resize", this.resizeListener);
         
  }, 
 
  mounted(){
	  var node = this.$el.querySelector(".formater-map > div");
	
      ftMap.initialize( node, this.lang);
      this.resize();
	  

  },
  destroyed(){
	  document.removeEventListener('findFeatureEvent', this.findFeatureListener);
      this.findObservatoriesListener = null;
      document.removeEventListener('selectAreaDrawEnd', this.aeraResetListener);
      this.areaResetListener = null;
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = null;
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
#formatermap .leaflet-popup-content input[type="button"],
#formatermap .leaflet-control-earth-list input[type="button"]{
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
#formatermap .leaflet-popup-content input[type="button"]:hover,
#formatermap .leaflet-control-earth-list input[type="button"]:hover{
	background:#f39b30;
}
#formatermap .leaflet-popup-content input[type="button"].selected,
#formatermap .leaflet-control-earth-list input[type="button"].selected{
	background: #D53E2A;
	border-color: #dd6555 #aa3222 #aa3222;
	text-shadow: 0 -1px 1px #802519, 1px 0 1px #aa3222, 0 1px 1px #aa3222, -1px 0 1px #802519;
}
#formatermap .leaflet-popup-content input[type="button"].selected:hover{
  	ackground: #ef2a10;
}
#formatermap .leaflet-popup-content div > div{
	margin-bottom:15px;
}
/**
 style pour leaflet.earth-layer.js
 **/

#formatermap a.leaflet-control-earth-toggle{
	font-family: FontAwesome;
	text-decoration: none;
	color:rgba(0,0,0,0.6);
	font-size: 30px;
	padding:10px;

}
#formatermap .leaflet-control-earth{
	display:none;
}
#formatermap div.leaflet-control-earth.has-content{
	display:block;
}
#formatermap .leaflet-control-earth .leaflet-earth-popup-title{
	display:none;
	color: rgb(221, 153,70);
	
}
#formatermap .leaflet-control-earth a.leaflet-popup-close-button{
	display:none;
}

#formatermap .leaflet-control-earth.leaflet-control-earth-expanded a.leaflet-popup-close-button{
	display:block;
}
#formatermap .leaflet-control-earth.leaflet-control-earth-expanded .leaflet-earth-popup-title{
	display: inline-block;
}
#formatermap .leaflet-control-earth.leaflet-control-earth-expanded{
	background: white;
	color: #333;
	box-shadow: 0 3px 14px rgba(0,0,0,0.4);
	border: none;
	border-radius: 12px;
}
#formatermap .leaflet-control-earth.selected .leaflet-control-earth-toggle{
	color: rgba(255,0,0,0.6)
}
#formatermap .leaflet-control-earth{
	border: 2px solid rgba(0,0,0,0.2);
	background-clip: padding-box;
	background:#fff;
	border-radius:5px;
    color: rgba(0,0,0,0.5);
    cursor:pointer;
}
#formatermap .leaflet-control-earth form{
  display:none;
  width:300px;
  margin: 10px 15px;
  overflow-y:auto;
}
#formatermap .leaflet-control-earth.leaflet-control-earth-expanded form{
	display:block;
	padding-top:3px;
}
/** layer grouped style**/
#formatermap .leaflet-control-layers{
	display:none;
}
#formatermap div.leaflet-control-layers.has-content{
	display:block;
}
#formatermap .leaflet-control-layers h4{
    display:block;
	background:white;
	margin:0;
	padding:0;
	height:auto;
	vertical-align:middle;
	font-size:16px;
	
}
#formatermap .leaflet-control-layers h4 span{
   
	display:none;
}

#formatermap .leaflet-control-layers-expanded h4{
	margin:-6px -10px 0px -6px;
	background-color:red;
	display:block;

	height:40px;
}
#formatermap .leaflet-control-layers-expanded h4 span{
    display:inline-block;
    vertical-align:middle;
	padding: 5px 10px 5px 5px;
}
#formatermap .leaflet-control-layers-expanded .leaflet-control-layers-toggle{
  display:inline-block;
  vertical-align:middle;
}
#formatermap .leaflet-control-layers-group-name{
	font-weight: bold;
}
#formatermap .leaflet-control-layers-label{
	margin-left:20px;
}
#formatermap .selected-area label{
	font-weight:bold;
}

#formatermap .leaflet-control-layers-group.selected-area{
	padding-bottom:5px;
	margin-bottom: 5px;
	border-bottom: 1px dotted grey;
}
</style>