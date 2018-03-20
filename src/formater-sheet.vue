<i18n>
{
   "en":{
        "organism":    "organism",
        "code": "code",
        "name": "name",
        "description": "Description",
        "contacts": "Contacts",
        "country": "country",
        "temporal": "temporal",
        "url": "url",
        "main contact": "Main Contact",
        "pointOfContact": "Contact",
        "alternate contact": "Alternate Contact",
        "information_links": "Information links",
        "data_access": "Data Access",
        "other_information": "Other information",
        "data_center": "Data Center",
        "HTTP_DOWNLOAD_LINK": "Http download links",
        "FTP_DOWNLOAD_LINK": "Ftp download links",
        "data": "Data",
        "from": "from",
        "to": "to",
        "temporal_extents": "Temporal extents",
        "now": "Now",
        "license": "License",
        "type":"Data type",
        "GeomagneticData": "Geomagnetism",
        "time series": "time series",
        "timeResolution": "Time resolution",
        "processingLevel": "Processing Level",
        "shortName": "Variables",
        "domainOfInterest": "Domain of interest",
        "Geomagnetic Field": "Geomagnetic Field",
        "ObservedProperty": "Observed property",
        "metadata_update": "Last metadata update",
        "procedure": "Procedure",
        "algorithms": "Algorithms",
        "method": "Method",
        "data_last_update": "Data last update",
        "download": "Download"
    
       
        
   },
   "fr":{
         "organism":    "organisme",
         "code": "code",
         "name": "nom",
         "description": "Description",
         "contacts": "Contacts",
         "country": "pays",
         "temporal": "intervalle de temps",
         "url": "url",
         "main contact": "Contact",
         "pointOfContact": "Contact",
         "alternate contact": "Autre Contact",
         "information_links": "Liens d'information",
         "data_access": "Accès aux données",
         "other_information": "Autre information",
         "data_center": "Centre de données",
         "HTTP_DOWNLOAD_LINK": "Liens de téléchargement http",
         "FTP_DOWNLOAD_LINK": "Liens de téléchargement ftp",
         "data": "Données",
         "from": "du",
         "to": "au",
         "temporal_extents": "Extension temporelle",
         "now": "Aujourd'hui",
         "license": "Licence",
         "type":"Type de données",
          "GeomagneticData": "Géomagnétisme",
         "time series": "Séries temporelles",
         "timeResolution": "Résolution temporelle",
          "processingLevel": "Niveau de traitement",
          "shortName": "Variables",
        "domainOfInterest": "Domaines",
         "Geomagnetic Field": "Champ géomagnétique",
          "ObservedProperty": "Propriété observée",
           "metadata_update": "Dernière mise à jour des métadonnées",
           "procedure": "Procédure",
        "algorithms": "Algorithmes",
        "method": "Méthode",
         "data_last_update": "Dernière mise à jour des données",
          "download": "Téléchargement"
          
   }
}
</i18n>
<template>
	<span class="formater-sheet-container" :class="hidden ? 'hidden' : ''" >
		
		<header class="formater-sheet-header">
		  <h3>{{ title }}</h3>
		  <span class="fa fa-close" @click="close"></span>
		</header>
		<main class="formater-sheet-main">
		<div class="formater-sheet-data-metablock" v-if="data && data.description">
			<h4 :style="styleTitle">
			<i class="fa fa-comment-o"></i>
			{{ $t("description")}}
			</h4>
			<main >
			<div v-html="data.description[lang]"></div>
			
			</main>
		</div>
		<div  class="formater-sheet-data-metablock" v-show="hasGraph">
		  <h4 :style="styleTitle"><i class="fa fa-line-chart"></i>
		  <span v-html="chartTitle"></span>
		  </h4>
		  <div id="ftChartContainer"></div>
		</div>
		
		
		
		 <div class="formater-information-container">
		  <div class="formater-column">
			  	<div class="formater-sheet-data-metablock-50"  v-if="data && data.temporalExtents">
                   <h4 :style="styleTitle">
                    <i class="fa fa-clock-o"></i>
                    {{ $t("temporal_extents")}}
                    </h4>
                    
                    <main>
                     <div class="formater-paragraph">
                          {{startDate}} <i class="fa fa-long-arrow-right" :style="styleTitle"></i> {{endDate}}
                        
	 					<div v-if="data.dataLastUpdate" class="formater-sub" style="margin-top:10px;">
		                   <span :style="styleTitle">
		                    {{ $t("data_last_update")}}
		                    </span>
		                    
		                    <main>
		                     <div >
		                          {{ iso2str( data.dataLastUpdate )}} 
		                        </div>
		                    </main>                       
	                        </div>
                      </div>
                    </main>
                   
                  
                  </div>
                  <div class="formater-sheet-data-metablock-50"  v-if="data && data.formats">
                   <h4 :style="styleTitle">
                    <i class="fa fa-file"></i>
                    Format
                    </h4>
                    
                    <main>
                     <div class="formater-paragraph" v-for="format in data.formats">
                          {{format.name}}
                        </div>
                    </main>
	               
	              </div>
	              <div class="formater-sheet-data-metablock-50"  v-if="data && data.license">
                   <h4 :style="styleTitle">
                    <i class="fa fa-legal"></i>
                    {{$t("license")}}
                    </h4>
                    
                    <main>
                     <div class="formater-paragraph" >
                     		<a :href="data.license.url" v-if="data.license.url" target="_blank">
                     		<span>{{ data.license.code}}</span>
                     		</a>
                        </div>
                    </main>
                   
                  </div>
                 <div class="formater-sheet-data-metablock-50" v-if="data && data.links && data.links.existType('HTTP_DOWNLOAD_DIRECT_LINK')">
                  <h4 :style="styleTitle">
                    <i class="fa fa-download"></i>
                    {{$t("download")}}
                    </h4>
                    <main>
                     <div class="formater-paragraph" v-for="link in data.links" v-if="link['type'] == 'HTTP_DOWNLOAD_DIRECT_LINK'">
                        <a :href="link.url" >{{ link.description ? link.description[lang]: link.url}}</a>
                       
                     </div>
                     </main>
                 </div>
	             
	            </div>
	            <!-- fin de column 1 -->
		                                     
		     <!-- end column 1-->
            <div class="formater-column"> 
            
	            <div class="formater-sheet-data-metablock-50"  v-if="data && data.quicklook">
		            <main>
		            <div v-for="image in data.quicklook" style="text-align:center;">
		             <img class="formater-quicklook" :src="image.url" :alt="image.description" />
		            </div>
		            </main>
	            </div>
                 
	           
	        </div><!-- end column 2 -->
		</div><!-- end information -->
		<div class="formater-sheet-data-metablock"  v-if="existDownloadLink()">
                   <h4 :style="styleTitle">
                    <i class="fa fa-database"></i>
                    {{ $t("data_access")}}
                    </h4>
                    
                    <main>
                   
                    <div class="formater-sub">
                    <span :style="styleTitle" v-if="data.links.existType('HTTP_DOWNLOAD_LINK')">{{$t('HTTP_DOWNLOAD_LINK')}} :</span>
                     <div class="formater-paragraph" v-for="link in data.links" v-if="link['type'] == 'HTTP_DOWNLOAD_LINK'">
                        <a :href="link.url" target="_blank">{{ link.url}}</a>
                        <div class="formater-paragraph" v-if="link.description">{{link.description[lang]}}</div>
                     </div>
                   </div>
                   <div class="formater-sub" v-if="data.links.existType('FTP_DOWNLOAD_LINK')">
                     <span :style="styleTitle" >{{$t('FTP_DOWNLOAD_LINK')}} :</span>
                     <div class="formater-paragraph" v-for="link in data.links" v-if="link['type'] == 'FTP_DOWNLOAD_LINK'">
                        <a :href="link.url" target="_blank">{{link.description ? link.description[lang]: link.url}}</a>
                        
                     </div>
                     </div>
                    </main>
               
        </div>
	             
		<!-- debut -->
		<div class="formater-information-container">
		  <div class="formater-column">
		  <div class="formater-sheet-data-metablock-50"  v-if="data && data.links && data.links.existType('INFORMATION_LINK')">
                   <h4 :style="styleTitle">
                    <i class="fa fa-link"></i>
                    {{ $t("information_links")}}
                    </h4>
                    <main>
                     <div class="formater-list" v-for="link in data.links" v-if="link['type'] == 'INFORMATION_LINK'">
                        <a :href="link.url" target="_blank">{{ link.url}}</a>
                        <div class="formater-paragraph" v-if="link.description">{{link.description[lang]}}</div>
                     </div>
                    </main>
               
               </div>
		     <div class="formater-sheet-data-metablock-50"  v-if="data">
                   <h4 :style="styleTitle">
                    <i class="fa fa-info"></i>
                    {{ $t("other_information")}}
                    </h4>
                    <main>
                    <div class="formater-sub" v-if="data.identifiers && data.identifiers.DOI">
                    	<span :style="styleTitle">DOI</span>
						<div class="formater-paragraph">
					   		{{ data.identifiers.DOI }}
						</div>
                    </div>
                    <div class="formater-sub" v-if="data.processingLevel" >
						<span :style="styleTitle">{{ $t("processingLevel")}}</span>
						<div class="formater-paragraph">
					   		{{data.processingLevel}}
						</div>
					</div>
                   
                     <div class="formater-sub" v-if="data.formaterDataCenter">
                        <span :style="styleTitle">{{$t("data_center")}} ForM@Ter :</span>
                        <div class="formater-paragraph">
                        <span v-if="data.formaterDataCenter.name">{{data.formaterDataCenter.name}} </span>
                        <span v-if="data.formaterDataCenter.code">{{data.formaterDataCenter.code}} </span>
                     	</div>
                     </div>
                     <div class="formater-sub" v-if="data.metadataLastUpdate">
                        <span :style="styleTitle">{{$t("metadata_update")}} :</span>
                        <div class="formater-paragraph">{{ iso2str( data.metadataLastUpdate )}}
                        </div>
                     </div>
                     
                    </main>
               
              </div>
		  </div>
		  <div class="formater-column">
		   <div class="formater-sheet-data-metablock-50" v-if="data  && data.contacts" >
	            <h4 :style="styleTitle">
	            <i class="fa fa-users"></i>
	            {{ $t("contacts")}}
	            </h4>
	            <main>
	            <div class="formater-list" v-for="contact in data.contacts" >
	              <div class="formater-function" :style="styleTitle">{{ $t(contact.roles[0])}}</div>
	                <div style="font-weight:600;"><i class="fa fa-user"></i> {{ contact.name}}</div>
	                <div class="formater-paragraph" >
		                <a :href="'mailto:'+contact.email" :style="styleTitle">{{contact.email}}</a>
		                <div v-if="contact.organisation" class="formater-organisation" >{{contact.organisation}}</div>
		                <div v-if="contact.address">
			                <div v-for="item in contact.address.streetAddress">{{item}}</div>
			                <div v-if="contact.address.postOfficeBoxNumber">P.O. box {{contact.address.postOfficeBoxNumber}}</div>
			                <div v-if="contact.address.addressLocality"><span v-if="contact.address.postalCode">{{contact.address.postalCode}}</span>
			                {{contact.address.addressLocality}}</div>
			                <div v-if="contact.address.addressCountry">{{contact.address.addressCountry}}</div>
			                <div v-if="contact.telephone">Tel: {{contact.telephone}}</div>
		                </div>
	                </div>
	            </div>
	            </main>
	          </div>
		  </div>
		</div>
		<div class="formater-sheet-data-metablock" v-if="data && data.observedProperty">

		  <h4 :style="styleTitle">
		  <i class="fa fa-eye"></i>
		  {{ $t("ObservedProperty") }}
		  </h4>
		<main>
		  <div>
			    <div v-if="data.observedProperty.name || data.observedProperty.shortName" style="width:48%; float:left;">
			    <span :style="styleTitle">Variable</span>
			     <div class="formater-paragraph" v-if="data.observedProperty.name">{{data.observedProperty.name[lang]}}</div>
			      <div class="formater-paragraph" v-if="data.observedProperty.shortName">{{data.observedProperty.shortName}}</div>
			     
			    </div>
			<!--  <div v-if="data.observedProperty" style="width:48%; float:left;">-->
			  	<div class="formater-list" style="width:48%; float:left;" v-for="(infos, key) in data.observedProperty" :key="key" v-if="key!='name' && key!='shortName'" >
                        <span :style="styleTitle">{{ $t(key)}}</span>
                        <div class="formater-paragraph">
                        <span v-if="key!= 'timeResolution'">{{ $t( infos) }}</span>
                        <span  v-if="key == 'timeResolution'" v-for="info in infos">{{info}} </span>
                        </div>
                </div>
                     
             <!--   </div>--> 
			
			
			<div style="clear:left;"></div>
			</div>
			</main>
			</div>
			<!-- fin -->
			<div class="formater-sheet-data-metablock" v-if="data && data.procedure">
			<h4 :style="styleTitle">
			<i class="fa fa-cogs"></i>
			{{ $t("procedure")}}
			</h4>
			<main >
			<div class="formater-sub" v-if="data.procedure.method && data.procedure.method[lang]">
				<div class="fa fa-cog"  style="font-weight:600;">  {{ $t("method")}}</div>
				 <div class="formater-paragraph" v-html="data.procedure.method[lang]">
				 
				 </div>
			</div>
			<div class="formater-sub" v-if="data.procedure.instruments">
				 <div class="fa fa-tachometer" style="font-weight:600;"> Instruments</div>
				 <div v-for="instrument in data.procedure.instruments" class="formater-paragraph">
				  - {{ instrument }}
				 </div>
			</div>
			<div class="formater-sub" v-if="data.procedure.algorithms">
				<div class="fa fa-code"  style="font-weight:600;">  {{ $t("algorithms")}}</div>
				 <div v-for="algorithm in data.procedure.algorithms" class="formater-paragraph" v-html="algorithm">
				 
				 </div>
			</div>
			</main>
		</div>
		</main>
	</span>
</template>
<script>


Array.prototype.existType = function( type){
	var i=0;
    find = false;
    while( !find && i< this.length){
        if( this[i].type == type){
            find = true;
        }
        i++;
    }
    return find;
}

var ftChart = require("./formater-chart.js");
export default {
	props: {
		 lang: {
	          type: String,
	          default: 'fr'
	      },
	      maxheight: {
	    	  type: Number,
	    	 // default: 600
	      }
	},
	watch: {
		maxheight(newVal, oldVal){
			//console.log("watch");
			console.log( "height" + newVal);
			if(this.$el && this.$el.querySelector ){
				var header = this.$el.querySelector(".formater-sheet-header").offsetHeight;
				this.$el.querySelector(".formater-sheet-main").style.maxHeight = newVal +"px";
			}
			return newVal;
		}
	},
	computed:{
		styleTitle(){
            return 'color:'+this.color+';';
        },
        startDate(){
        	if(this.data){
        		return moment(this.data.temporalExtents.start, "YYYY-MM-DD").format("ll");
        	}else{
        		return "";
        	}
        },
        endDate(){
        	   if( this.data && this.data.temporalExtents ){
        		   if(this.data.temporalExtents.end == "now"){
        			   return this.$i18n.t("now");
        		   }else{
        			   return  this.iso2str(this.data.temporalExtents.end);
        		   }
		        }else{
		            return "";
		        }
        }
       
       
	},
	data(){
		return {
			title: 'le titre',
			chartTitle: 'graph',
			aerisSearchEventListener:null,
			displayInfoListener:null,
			findDataListener:null,
			unselectLayerListener:null,
			hidden: true,
			color: "#D53E2A",
			data:null,
			searched:false,
			charts:null,
			code:null,
			hasGraph: false
			
		}
	},

	methods:{
		 
		
	     
	     close(){
	  		
	    	 var event = new CustomEvent("closeSheet", { detail:{}});
       	    document.dispatchEvent(event);
	     },
	     hide( ){
	    	
	    	 ftChart.destroyCharts();
	    	 this.hasGraph = false;
	    	 this.chartTitle = "";
	    	// this.$el.querySelector("#container").style.display = "none";
	    	 this.hidden = true;
	    	 this.code ="";
	     },
	     iso2str( date){
	    	 return moment( date, "YYYY-MM-DD").format("ll");
	     },
	     open( observation, cds){

	    	  
	    	   this.title = observation.title[this.lang];
               this.data = observation;
               
               if( observation.data && observation.query){
            	   var container = this.$el.querySelector("#ftChartContainer");
            	  
               		this.hasGraph = ftChart.createChart(container, cds ,observation.data, this.code, observation.query);
               		if( this.hasGraph){
        	    		this.chartTitle = ftChart.createChartTitle( );
        	    	}
               }

               
               this.$el.querySelector(".formater-sheet-main").scrollTop = 0;
               this.hidden = false;
	     },
	     existDownloadLink(){
	    	 if( this.data && this.data.links){
	    		 var links = this.data.links;
	    		 if(  links.existType('HTTP_DOWNLOAD_LINK') || links.existType('FTP_DOWNLOAD_LINK')){
	    			 return true;
	    		 }else{
	    			 return false;
	    		 }
	    			
	    	 }else{
	    		 return false;
	    	 }
	    			 
	     },
	     handleCreateChart(event){
	    	 if(!this.$el.querySelector ){
                 return;
             }
	    	 var container= this.$el.querySelector("#ftChartContainer");
 
            
	    	 var data0 = event.detail.obs.data;
	    	 var query = event.detail.obs.query;
// 	    	 console.log( "ft-sheet handle create chart");
// 	    	 console.log( event.detail);
	    	
	    	 this.hasGraph = ftChart.createChart( container, event.detail.cds,data0, this.code, query);
	    	if( this.hasGraph){
	    		this.chartTitle = ftChart.createChartTitle( );
	    	}
	    	 
	     },

	     displayInfo( event){
	    	 
	    	 var options = event.detail.layer.options;
	    	 var observation = event.detail.observation;
	    	 var query = observation.query != "undefined" ? observation.query:null;
	    	 console.log( query);
	         var code = observation.identifiers.customId;

			
	    	 if( this.code == code){
	    		 this.hide();
	    		 return;
	    	 }
	    
	         this.code = code;
	         console.log( this.code);
	         var _self = this;
			 var next = function(){ 
				 console.log("dans next");
				 console.log(query);
				 _self.open(  observation, options.cds, query);
			 }
	         setTimeout( next, 300);
	    	
	    	 
	     }
		
	},
	created(){
		this.$i18n.locale = this.lang;
		moment.locale(this.lang);
		//this.aerisThemeListener = this.handleTheme.bind(this) 
       // document.addEventListener('aerisTheme', this.aerisThemeListener);
		this.aerisSearchEventListener = this.close.bind(this);
		document.addEventListener('aerisSearchEvent', this.aerisSearchEventListener);
		this.displayInfoListener = this.displayInfo.bind(this) 
        document.addEventListener('displayInfo', this.displayInfoListener);
		this.findDataListener = this.handleCreateChart.bind(this) 
        document.addEventListener('findData', this.findDataListener);
		this.unselectLayerListener = this.hide.bind(this);
		document.addEventListener('unselectInput', this.unselectLayerListener);
		
	
	},
	mounted(){
		   
        ftChart.init( this.lang);
		this.$el.style.maxHeight = this.maxHeight +"px";
		if(this.$el.querySelector && this.$el.querySelector(".formater-sheet-container")){
            var header = this.$el.querySelector(".formater-sheet-container header").offsetHeight;
            this.$el.querySelector(".formater-sheet-container main").style.maxHeight = (newVal -90)+"px";
        }
		var event = new CustomEvent('aerisThemeRequest', {});
	     document.dispatchEvent(event);
	},
	destroyed(){
		 document.removeEventListener('aerisTheme', this.aerisSearchEventListener);
         this.aerisSearchEventListener = null;
         document.removeEventListener('aerisSearchEvent', this.findDataListener);
         this.findDataListener = null;
         document.removeEventListener('displayInfo', this.displayInfoListener);
         this.displayInfoListener = null;
         document.removeEventListener('findData', this.findDataListener);
         this.findDataListener = null;
         
	}
}
</script>
<style>
.formater-sheet-container{
    position:absolute;
    top:20px;
    right:0;
    background-color:#fff;
    width:620px;
    min-height:100px;
    -ms-transform: translateX(0);
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -o-transform: translateX(0);
    transform: translateX(0);
    z-index:450;
        box-shadow: 1px 1px 5px rgba(0,0,0,.65);
    -ms-transition: -ms-transform .5s;
    -webkit-transition: -webkit-transform .5s;
    -moz-transition: -moz-transform .5s;;
    -o-transition: -o-transform .5s;
    transition: transform  .5s;
    transition-timing-function: ease, ease;
    -ms-transition-timing-function: ease-in-out;
    -webkit-transition-timing-function: ease-in-out;
    -moz-transition-timing-function: ease-in-out;
    -o-transition-timing-function: ease-in-out;
    transition-timing-function: ease-in-out;
}
.formater-sheet-container.hidden{
    -ms-transform: translateX(640px);
    -webkit-transform: translateX(640px);
    -moz-transform: translateX(640px);
    -o-transform: translateX(640px);
    transform: translate(640px);
	 -ms-transition: -ms-transform  .3s;
	-webkit-transition: -webkit-transform  .3s;
	-moz-transition: -moz-transform .3s;
	-o-transition: -o-transform .3s;
	transition: transform .3s;
	transition-timing-function: ease, ease;
	-ms-transition-timing-function: ease-in-out;
	-webkit-transition-timing-function: ease-in-out;
	-moz-transition-timing-function: ease-in-out;
	-o-transition-timing-function: ease-in-out;
	transition-timing-function: ease-in-out;
}
.formater-sheet-container header{
    margin:0;
    padding:5px;
    color:#fff;
    background-color:#D53E2A;
}

.formater-layout .formater-sheet-container main  h4{
    color:#000;
}
 .formater-sheet-container header h3{
    display:inline-block;
    margin:0;
    max-width:575px;
   }
    .formater-sheet-container header span.fa-close{
        float:right;
        cursor:pointer;
    }
    .formater-sheet-container .formater-sheet-main{
    margin: 0 ;
    overflow-y:auto;
    background:#f1f1f1;
   /* max-height:300px;*/
    }
    
    .formater-sheet-container main h4{

        display:inline-block;
        margin: 3px;
    }
   .formater-sheet-container .formater-information-container{
        display:flex;
    }
    .formater-sheet-container .formater-column{
        max-width:300px;
        margin-left:5px;
    }
    .formater-sheet-data-metablock{
        background:white;
        margin:5px 0 5px 5px;
        max-width:595px;
        padding:3px;
        box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);
    }
   
    .formater-sheet-data-metablock main,
    .formater-sheet-data-metablock-50 main
    {
        margin-left:15px;
        padding-bottom:5px;
       
    }
    .formater-sheet-data-metablock-50{
        width:289px;
        float:left;
        padding:3px;
        margin-bottom:5px;
        border-radius:2px;
        box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);
        background:white;
    }
    .formater-sheet-container div.formater-sub{
    	margin-bottom:10px;
    }
    .formater-sheet-container main h4::after{
        content:" :";
    }
    .formater-sheet-container main h4::first-letter{
        text-transform:uppercase;
    }
    .formater-sheet-container .formater-paragraph{
       border-left:1px solid #999;
       padding-left:10px;
       margin-left:5px;
       font-size:0.9rem;
    }
    .formater-sheet-container .formater-quicklook{
        max-width: 270px;
    }
    .formater-sheet-container .formater-function{
        margin-bottom:5px;
    }
    .formater-sheet-container .formater-list{
        margin-left:0px;
        margin-top:8px;
    }
    .formater-sheet-container .formater-organisation{
        font-weight:600;
        margin-top:6px;
    }
    .formater-sheet-container ul{
        list-style-type:none;
        padding-left:5px;
    }
</style>