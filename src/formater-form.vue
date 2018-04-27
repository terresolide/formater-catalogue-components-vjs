<i18n>
{
   "en":{
   	"data_type":	"data type",
       "time_slot": 	"time slot",
       "spatial_extents": "spatial extents",
       "output_format": "Output Format",
       "search": "Search",
       "update": "Update",
       "geomagnetism": "Geomagnetism",
       "geodesy": "Geodesy",
       "service_closed": "The service is closed"
   },
   "fr":{
   		"data_type": "type de données",
        "time_slot": 	"intervalle de temps",
        "spatial_extents": "zone géographique",
        "output_format": "Format de sortie",
        "search": "Rechercher",
        "update": "Mettre à jour",
      	"geomagnetism": "Geomagnétisme",
      	"geodesy": "Geodésie",
      	"service_closed": "Le service est fermé"
   }
}
</i18n>

<template>	
	<div class="formater-container">
	<div id="formater-form" >
		<formater-search-box header-icon-class="fa fa-bars" :title="$t('data_type')" deployed="true">
			<formater-select type="associative" name="DataType" :options="jsonDataType()" :defaut="dataType" multiple="true" width="260px"></formater-select>
		</formater-search-box>
		<formater-search-box header-icon-class="fa fa-calendar" :title="$t('time_slot')" deployed="true">	
			 <formater-temporal-search :lang="lang" :daymin="daymin" @update="change"></formater-temporal-search>
		</formater-search-box>
		<formater-search-box header-icon-class="fa fa-globe" :title="$t('spatial_extents')" deployed="false">	
			<formater-spatial-search :lang="lang"></formater-spatial-search>
		</formater-search-box>
	    <a id="download" href="#" style="display=none;" download="bcmt_data.zip"></a>
	    <input type="hidden" v-model="searching" />
	    <div class= "formater-buttons" >
	    <input class="formater-search-button" type="button"  @click="search" :disabled="searching || hasChanged == 0" :value="$t('update')"/>
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
	  daymin:{
		  type:String,
		  default:"1868-01-01"
	  },
      lang: {
          type: String,
          default: 'fr'
      },
      url:{
          type: String,
          default: 'http://api.formater/api'
         // default: 'https://rawgit.com/terresolide/formater-catalogue-components-vjs/master/data/geojson_observatories.json'
         //default: 'http://formater.art-sciences.fr/cds/bcmt/obs'
      }
      
  },
  
//   computed:{
// 	  textSearch(){
// 	    	if( this.hasChanged > 1){
// 	    		return this.$i18n.t('search');
// 	    	}else{
// 	    		return this.$i18n.t('update');
// 	    	}
	    	
// 	    }
//   },
  data(){
      return {
    	   dataType:["geomagnetism", "geodesy"],
           aerisThemeListener:null,
           temporalChangeListener:null,
           theme:null,
           searching:true,
           hasChanged:0,
           disableSearch: true,
           //searchText: 'update',
          // disableSearch: this.searching || this.hasChanged == 0,
           cds: [{ name:"bcmt", domain:"geomagnetism"},{name:"isgi", domain:"geomagnetism"}, {name:"grenoble", domain:"geodesy"}]
         
      }
  },

  methods: {
	    reset(e){
	    	
	    },
// 	    disableSearch(){
// 	    	return (this.hasChanged == 0 || this.searching)? true : false;
// 	    },
	    /*disableSearch(){
			  var bool = (this.hasChanged == 0 || this.searching)? true : false;
			  console.log( bool);
			  return bool;
		  },*/
	    change( event){
			  //@todo depend de la profondeur apparemment l'événement n'est pas déclenché...
	    	console.log( "change");
	    	this.searching = false;

	    },
	    status( event){
	    	//@todo en considérant la remarque précédente: comme le @update n'est pas déclenché
	    	// on utilise un evenement global 'temporalChangeEvent'
	    	console.log( event);
	    	if( this.hasChanged === 0){
	    		this.hasChanged = 1;
	    	}
	    	this.searching = false;

	    },
// 	    dependencies(){
// 	    	console.log("ici");
// 	    	console.log( this.searching);
// 	    	return [ this.searching, this.hasChanged];
// 	    },
// 	    set(){
// 	    	this.disableSearch = this.searching || ( this.hasChanged === 0);
	    	 
// 	    	if( this.hasChanged > 1){
	    		
// 	    		this.searchText = this.$i18n.t('search');
// 	    	}else{
// 	    		this.searchText = this.$i18n.t('update');
// 	    	}
// 	    },
    
	    jsonDataType(){
	    	var arrType = {};
	    	var _this = this;
	    	this.dataType.forEach( function( type){
	    		arrType[ type] = _this.$i18n.t(type);
	    	})
	    
	    	return JSON.stringify( arrType).replace(/"/g, "'");
	    },

	
		search(){
	    	this.searching = true;
	  
		    var e = new CustomEvent("aerisSearchEvent", { detail: {}});
			document.dispatchEvent(e);
			if( e.detail.error){
				this.searching = false;
				var event = new CustomEvent('aerisErrorNotificationMessageEvent', { 'detail': {message: this.$i18n.t('input error')}});
				document.dispatchEvent(event);
				//return;
			}else{
				
				//var event = new CustomEvent('aerisErrorNotificationMessageEvent', { 'detail': {message: this.$i18n.t('service_closed')}});
              //  document.dispatchEvent(event);
               if( this.hasChanged < 2){
            	   this.update(e);
               }else{
                	var result = this.callApi(e);
               }
               // return;
			}
		},
		searchText(){
						if( this.hasChanged > 1){
							return this.$i18n.t('search');
						}else{
							return this.$i18n.t('update');
						}
		},
		callApi(e){
			  
			  var _this = this;
			  var data = e.detail;
			  
			  //@todo evenement différent (detail à paramétrer) 
			  var e = new CustomEvent("callApiEvent", { detail: {}});
				document.dispatchEvent(e);

			  
			  if(data.box ){
				  if(data.box.west){
				  	data.bbox = data.box.west+","+data.box.south +"," +data.box.east+","+data.box.north;
				  }
				  delete data.box;
			  }
			  if(!data.start){
				  data.start = this.daymin;
			  }
			  if(!data.end){
				  data.end = moment().format("YYYY-MM-DD");
			  }
			 
			  this.callApiByCds(0, data);
			  //data.isgi = 1;
			 // this.$http.get( this.url,{params: data}).then( 
              //        response => {_this.handleSuccess( response, data)},
             //         response => {_this.handleError( response , data)});
			  
  
		},
		callApiByCds( i, data){
			if( i < this.cds.length){
				var params = data;
				//console.log( data);
				var cds = this.cds[i].name;
				//console.log(data.DataType);
				//console.log(this.cds[i].domain);
				if( data.DataType.indexOf(this.cds[i].domain)>=0){
				    params.cds = cds;
					var _this = this;
					var index = i;
					this.$http.get( this.url, {params:params}).then(
							response => { _this.handleSuccess( response, params, cds);  _this.callApiByCds( index+1, data);},
		                    response => { _this.handleError( response ,  params, cds); _this.callApiByCds( index+1, data);}
					);
				}else{
					this.callApiByCds( i+1, data);
				}
			}else{
		
				this.searching = true;
				this.hasChanged = 0;
			
			}
		},
		update( evt){
			var event = new CustomEvent( "updateObservations", {detail: evt.detail});
			document.dispatchEvent( event);
		},
		defaultRequest(){
			var data = { 
					DataType: this.dataType
					}
			this.callApi( {detail:data});
		},
		handleSuccess(rep, data, cds){
		   
		    var event = new CustomEvent("findFeatureEvent", {detail: {result:rep.body , id:Math.random(), query:{ cds:cds, start: data.start, end:data.end, bbox:data.bbox}}});
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
		  		var color = this.theme.primary;
		  		var color1 = this.$shadeColor( this.theme.primary, 0.1); //lightcolor
		  		var color2 = this.$shadeColor( this.theme.primary, -.1); //dark color
		  		var color3 = this.$shadeColor( this.theme.primary, 0.2);
		  		var button = this.$el.querySelector(".formater-search-button");
		  		button.style.borderColor= color1 + ' '+ color2 + ' ' + color2;
		  		button.style. textShadow=" 0 -1px 1px "+color3+" , 1px 0 1px "+color2+", 0 1px 1px "+color2+", -1px 0 1px "+color3;
		  		button.addEventListener("mouseover", function(e){

		  			this.style.backgroundColor = color1;
		  		});
		  		button.addEventListener("mouseout", function(e){
	
		  			this.style.backgroundColor = color;
		  		})
		  	}
		 },
	},
	
  created(){
      this.$i18n.locale = this.lang;
 
      this.searchText = this.$i18n.t('update');
      this.aerisThemeListener = this.handleTheme.bind(this) 
      document.addEventListener('aerisTheme', this.aerisThemeListener);
      
      this.temporalChangeListener = this.status.bind( this);
      document.addEventListener('temporalChangeEvent', this.temporalChangeListener);
      // solution pour double dépendances @see https://forum.vuejs.org/t/computed-not-updating-when-data-changes/27797/17
     
      
 
  },
  mounted(){
   
     var event = new CustomEvent('aerisThemeRequest', {});
     document.dispatchEvent(event);
     
     //call api for the first time
     if(!window.firstCall){ //@todo pas très propre d'utiliser une globale...
    	 // mounted est exécuté 2 fois!!
    	 // ce qui pose un problème car ma fonction est exécuté 2 fois!!
    	 window.firstCall = true;
	    this.defaultRequest();

  	}
  },
  destroyed(){
      document.removeEventListener('aerisTheme', this.aerisThemeListener);
      this.aerisThemeListener = null;
      
      document.removeEventListener('temporalChangeEvent', this.temporalChangeListener);
      this.temporalChangeListener = null;
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
 /*background: #DD9946;*/
  border-width: 1px;
  border-style: solid;
  border-radius: 1px;
  font-size: 16px;
 /* font-weight:bold;*/
  line-height:1.7;
  border-color: #e5b171 #cb8025 #cb8025;
  color: #fff;
  text-decoration: none;
  text-shadow: 0 -1px 1px #a0651d, 1px 0 1px #cb8025, 0 1px 1px #cb8025, -1px 0 1px #a0651d;
  vertical-align: top;
  cursor: pointer;
  pointer-events: auto;
  box-sizing: border-box;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
}
.formater-container .formater-buttons  input[type="button"].formater-search-button:hover{
background:#f39b30;
}
.formater-container input[type="button"]::first-letter{
	text-transform: uppercase;
}
.formater-container .formater-buttons  input[type="button"].formater-search-button:disabled{
    opacity:0.5;
	cursor:not-allowed;
}
</style>