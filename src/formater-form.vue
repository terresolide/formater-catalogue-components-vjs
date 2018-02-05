<i18n>
{
   "en":{
   	"data_type":	"data type",
       "time_slot": 	"time slot",
       "spatial_extents": "spatial extents",
       "output_format": "Output Format",
       "search": "Search",
       "magnetisme": "magnetism",
       "service_closed": "The service is closed"
   },
   "fr":{
   		"data_type": "type de données",
        "time_slot": 	"intervalle de temps",
        "spatial_extents": "zone géographique",
        "output_format": "Format de sortie",
        "search": "rechercher",
      "magnetisme": "magnétisme",
      "service_closed": "Le service est fermé"
   }
}
</i18n>

<template>	
	<div class="formater-container">
	<div id="formater-form" >
		<formater-search-box header-icon-class="fa fa-bars" :title="$t('data_type')" deployed="true">
			<formater-select type="associative" name="DataType" :options="dataType" multiple="true" width="260px"></formater-select>
		</formater-search-box>
		<formater-search-box header-icon-class="fa fa-calendar" :title="$t('time_slot')" deployed="true">	
			 <formater-temporal-search :lang="lang"></formater-temporal-search>
		</formater-search-box>
		<formater-search-box header-icon-class="fa fa-globe" :title="$t('spatial_extents')" deployed="true">	
			<formater-spatial-search :lang="lang"></formater-spatial-search>
		</formater-search-box>
	    <a id="download" href="#" style="display=none;" download="bcmt_data.zip"></a>
	    <div class= "formater-buttons" >
	    <input class="formater-search-button" type="button" :value="$t('search')" @click="search"/>
	    </div>
	</div>
	</div>
</template>



<script>


export default {

  props:{
	  info:{
	      type:String,
	      default:null
	  },
      lang: {
          type: String,
          default: 'fr'
      },
      url:{
          type: String,
         // default: 'http://api.formater/api'
         default: 'http://formater.art-sciences.fr/api'
         // default: 'https://rawgit.com/terresolide/formater-catalogue-components-vjs/master/data/geojson_observatories.json'
         //default: 'http://formater.art-sciences.fr/cds/bcmt/obs'
      }
      
  },
  computed:{
      dataType(){
          var interval = JSON.stringify({
              magnetisme: this.$i18n.t('magnetisme')
          }).replace(/"/g, "'");
          return interval;
      }
  },
  data(){
      return {
           aerisThemeListener:null,
           theme:null
      }
  },
  methods: {
      	
		search(){
		    var e = new CustomEvent("aerisSearchEvent", { detail: {}});
			document.dispatchEvent(e);
			if( e.detail.error){
				var event = new CustomEvent('aerisErrorNotificationMessageEvent', { 'detail': {message: this.$i18n.t('error')}});
				document.dispatchEvent(event);
				return;
			}else{

				//var event = new CustomEvent('aerisErrorNotificationMessageEvent', { 'detail': {message: this.$i18n.t('service_closed')}});
              //  document.dispatchEvent(event);
                var result = this.callApi(e);
                return;
			}
		},
		callApi(e){
			  var _this = this;
			  var data = e.detail;

	
			  if(data.box && data.box.west){
				  data.bbox = data.box.west+","+data.box.south +"," +data.box.east+","+data.box.north;
				  delete data.box;
			  }
			  this.$http.get( this.url,{params: data}).then( 
                      response => {_this.handleSuccess( response, data)},
                      response => {_this.handleError( response , data)});
			  
  
		},
		handleSuccess(rep, data){
		    
		  
		    
		    var event = new CustomEvent("findObservatoriesEvent", {detail: {result:rep.body , query:{ start: data.start, end:data.end}}});
		    document.dispatchEvent(event);
	
		   
		},
		handleError(rep, data){
		    
		},
		handleTheme(theme) {
		  		this.theme = theme.detail
				this.ensureTheme()
		},
		  	
		 ensureTheme() {
		  	if ((this.$el) && (this.$el.querySelector)) {
		  		this.$el.querySelector(".formater-search-button").style.background= this.theme.primary;
		  		var color1 = this.$shadeColor( this.theme.primary, 0.1); //lightcolor
		  		var color2 = this.$shadeColor( this.theme.primary, -.1); //dark color
		  		this.$el.querySelector(".formater-search-button").style.borderColor= color1 + ' '+ color2 + ' ' + color2;
		  	}
		 },
	},
	
  created(){
      this.$i18n.locale = this.lang;
 
      this.aerisThemeListener = this.handleTheme.bind(this) 
      document.addEventListener('aerisTheme', this.aerisThemeListener);
 
  },
  mounted(){
   
     var event = new CustomEvent('aerisThemeRequest', {});
     document.dispatchEvent(event);
  },
  destroyed(){
      document.removeEventListener('aerisTheme', this.aerisThemeListener);
      this.aerisThemeListener = null;
  }
}

</script>

<style>
.formater-container .formater-buttons input[type="button"]{
/*	font-family:  "Dejavu serif";*/
	margin: 0px 0px 3px 7px;
  padding: 3px 12px;
  /*white-space: normal;*/
  text-align: center;
/*  background: #DD9946;*/
  border-width: 1px;
  border-style: solid;
  border-radius: 1px;
  font-size: 16px;
 /* font-weight:bold;*/
  line-height:1.7;
  border-color: #e5b171 #cb8025 #cb8025;
  color: #fff;
  text-decoration: none;
 /* text-shadow: 0 -1px 1px #a0651d, 1px 0 1px #cb8025, 0 1px 1px #cb8025, -1px 0 1px #a0651d;*/
  vertical-align: top;
  cursor: pointer;
  pointer-events: auto;
  box-sizing: border-box;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
}
.formater-container input[type="button"]::first-letter{
	text-transform: uppercase;
}

</style>