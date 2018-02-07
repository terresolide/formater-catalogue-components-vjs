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
        "alternate contact": "Alternate Contact",
        "information_links": "Information links",
        "data_access": "Data Access",
        "other_information": "Other information",
        "data_center": "Data Center",
        "HTTP_DOWNLOAD_LINK": "Http download links",
        "data": "Data",
        "from": "from",
        "to": "to",
        "temporal_extents": "Temporal extents",
        "now": "Now",
        "license": "License"
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
         "alternate contact": "Autre Contact",
         "information_links": "Liens d'information",
         "data_access": "Accès aux données",
         "other_information": "Autre information",
         "data_center": "Centre de données",
         "HTTP_DOWNLOAD_LINK": "Liens de téléchargement http",
         "data": "Données",
         "from": "du",
         "to": "au",
         "temporal_extents": "Extension temporelle",
         "now": "Aujourd'hui",
         "license": "Licence"
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
			<main v-html="data.description[lang]">
			
			</main>
		</div>
		<div id="container" style="display:none;">
		  <h4 :style="styleTitle"><i class="fa fa-line-chart"></i>
		  <span v-html="chartTitle"></span>
		  </h4>
		</div>
		 <div class="formater-information-container">
		  <div class="formater-column">
			 
                  <div class="formater-sheet-data-metablock-50"  v-if="data && data.format">
                   <h4 :style="styleTitle">
                    <i class="fa fa-file"></i>
                    Format
                    </h4>
                    
                    <main>
                     <div class="formater-address">
                          {{data.format}}
                        </div>
                    </main>
	               
	              </div>
	              <div class="formater-sheet-data-metablock-50"  v-if="data && data.license">
                   <h4 :style="styleTitle">
                    <i class="fa fa-legal"></i>
                    {{$t("license")}}
                    </h4>
                    
                    <main>
                     <div class="formater-address" v-html="data.license">
                     
                        </div>
                    </main>
                   
                  </div>
	              <div class="formater-sheet-data-metablock-50"  v-if="data && data.temporalExtents">
                   <h4 :style="styleTitle">
                    <i class="fa fa-clock-o"></i>
                    {{ $t("temporal_extents")}}
                    </h4>
                    
                    <main>
                     <div class="formater-address">
                          {{startDate}} <i class="fa fa-long-arrow-right" :style="styleTitle"></i> {{endDate}}
                        </div>
                    </main>
                   
                  </div>
	                <div class="formater-sheet-data-metablock-50"  v-if="data && data.links && data.links.existType('HTTP_DOWNLOAD_LINK')">
	                   <h4 :style="styleTitle">
	                    <i class="fa fa-database"></i>
	                    {{ $t("data_access")}}
	                    </h4>
	                    
	                    <main>
	                    <span :style="styleTitle">{{$t('HTTP_DOWNLOAD_LINK')}} :</span>
	                     <div class="formater-address" v-for="link in data.links" v-if="link['type'] == 'HTTP_DOWNLOAD_LINK'">
	                        <a :href="link.url" >{{ link.url}}</a>
	                        <div class="formater-address" v-if="link.description">{{link.description[lang]}}</div>
	                     </div>
	                    </main>
	               
	              </div>
		                                     
		      <div class="formater-sheet-data-metablock-50" v-if="data  && data.contacts" >
	            <h4 :style="styleTitle">
	            <i class="fa fa-users"></i>
	            {{ $t("contacts")}}
	            </h4>
	            <main>
	            <div class="formater-list" v-for="contact in data.contacts" >
	              <div class="formater-function" :style="styleTitle">{{ $t(contact.roles[0])}}</div>
	                <div style="font-weight:600;"><i class="fa fa-user"></i> {{ contact.name}}</div>
	                <div class="formater-address" >
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
           
	          
	          
            </div><!-- end column -->
            <div class="formater-column"> 
            
	            <div class="formater-sheet-data-metablock-50"  v-if="data && data.quicklook">
		            <main>
		            <div v-for="image in data.quicklook" style="text-align:center;">
		             <img :src="image.url" :alt="image.description" />
		            </div>
		            </main>
	            </div>
	            <div class="formater-sheet-data-metablock-50"  v-if="data && data.links && data.links.existType('INFORMATION_LINK')">
                   <h4 :style="styleTitle">
                    <i class="fa fa-link"></i>
                    {{ $t("information_links")}}
                    </h4>
                    <main>
                     <div class="formater-list" v-for="link in data.links" v-if="link['type'] == 'INFORMATION_LINK'">
                        <a :href="link.url" >{{ link.url}}</a>
                        <div class="formater-address" v-if="link.description">{{link.description[lang]}}</div>
                     </div>
                    </main>
               
               </div>
	            <div class="formater-sheet-data-metablock-50"  v-if="data">
                   <h4 :style="styleTitle">
                    <i class="fa fa-info"></i>
                    {{ $t("other_information")}}
                    </h4>
                    <main>
                     <ul>
                     <li v-if="data.formaterDataCenter">
                        <span :style="styleTitle">{{$t("data_center")}} ForM@Ter :</span>
                        <span v-if="data.formaterDataCenter.name">{{data.formaterDataCenter.name}} </span>
                        <span v-if="data.formaterDataCenter.code">{{data.formaterDataCenter.code}} </span>
                     </li>
                     </ul>
                    </main>
               
              </div>
	        </div><!-- end column 2 -->
		</div><!-- end information -->
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
        			   return  moment(this.data.temporalExtents.end, "YYYY-MM-DD").format("ll");
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
			theme: '',
			aerisThemeListener:null,
			aerisSearchEventListener:null,
			displayInfoListener:null,
			findDataListener:null,
			unselectLayerListener:null,
			hidden: true,
			color: "#000",
			data:null,
			searched:false,
			charts:null,
			code:null
			
		}
	},

	methods:{
		 
		   handleTheme( theme ) {
	            this.theme = theme.detail;
	            this.ensureTheme();
	   
	      },
	        
	     ensureTheme() {
	    	  this.color =  this.$shadeColor( this.theme.primary, -0.2);
	        if ((this.$el) && (this.$el.querySelector)) {
	        	var color = this.theme.primary;
	            
	           
	            var nodes= this.$el.querySelectorAll(".formater-sheet-header");
	            [].forEach.call(nodes, function(node){
	                node.style.backgroundColor = color;
	            })
	           
	            
	        }
	     },
	     
	     close(){
	  
	    	 var event = new CustomEvent("closeSheet", { detail:{}});
       	  document.dispatchEvent(event);
	     },
	     hide(){
	    	 this.destroyCharts();
	    	 this.$el.querySelector("#container").style.display = "none";
	    	 this.hidden = true;
	    	 this.code ="";
	     },
	    
	     open( observation){
	    	   console.log( observation);
	    	   this.title = observation.title[this.lang];
               this.data = observation;
               
               if( observation.data)
               this.createChart(observation.data);
               //}
               this.hidden = false;
	     },
	     handleCreateChart(event){
	    	 if(this.$el.querySelector && this.$el.querySelector("#chartContainer")){
                 return;
             }
	    	 var data0 = event.detail.marker.options.properties.data;
	    	 this.createChart( data0);
	     },
	     destroyCharts(){
	    	//console.log( Highcharts.charts); 
	    	 for (var i = 0; i < Highcharts.charts.length; i = i + 1) {
	    		 if( typeof Highcharts.charts[i] != "undefined")
	    		 Highcharts.charts[i].destroy();
	    	 }
	    	
	    	 //remove container
	    	 var el = this.$el.querySelector("#chartContainer");
	    	 if(el)  el.parentNode.removeChild( el );
	     },
	     createChartTitle( dataType, begin, end){
	    	 
	    	 var chartTitle = this.$i18n.t("data") +" &quot;"+dataType + "&quot; "+ this.$i18n.t("from")+" "+ moment(begin, "YYYY-MM-DD").format("ll");
	            if(end != begin){
	                chartTitle += " " + this.$i18n.t("to") + " "+ moment(end, "YYYY-MM-DD").format("ll");;
	            }
	    	 this.chartTitle = chartTitle;
	     },
	     intervalType( intervalType, dataType){
	    	 if(dataType == "variation"){
	    		 return "%e. %b %H:%M";
	    	 }
	    	 switch(intervalType){
	    	 case "Filtered 1-minute":
	    		 return "%e. %b %H:%M";
	    	 case "1-day (01-24)":
	    	 case "1-day (00-23)":
	    		 return '%e. %b';
	    	 case "1-hour (00-59)":
	    		 return '%H:%M';
	    	 case "1-month (01-31)":
	    		 return '%e. %b %Y';
	    	 case "1-year":
	    		 return '%b %Y';
	    	  default:
	    		  return '%e. %b %Y';
	    	 }
	     },
	     createChart(data0){
	    	 //console.log(data0)
	    	 //console.log("createChart");
	    	 var parentContainer = this.$el.querySelector("#container");
	    	 var container = this.$el.querySelector("#chartContainer");
	    	 if(!container){
		    	 var container = document.createElement("div");
		    	 parentContainer.appendChild( container );
		    	 container.setAttribute("id", "chartContainer");	    	 
		    	 container.onmousemove = handle_global;
		    	 container.ontouchstart = handle_global;
		    	 container.ontouchmove = handle_global;
	    	 }else{
	    		 return;
	    	 }
	    	   // function createChart( data0) { 
	    	       // console.log(data0);
	    	var code = data0.meta.get("IAGA Code");
	    	if(this.code != code || data0.collection.length == 0 ){
	    		return;
	    	}
	    	var dataType = data0.meta.get("Data Type");
	        var interval = this.intervalType(data0.meta.get("Data Interval Type"), dataType);
	       
            this.createChartTitle( dataType, data0.collection[0].DATE, data0.collection[ data0.collection.length-1].DATE);
            
	    	       
	    	        var data = new Array();
	    	        var coord = new Array();
	    	        ["D", "H", "X", "Y",  "Z", "F"].forEach( function(index){
	    	        	if( data0.collection[0][index]){
	    	        		coord.push(index);
	    	        		data[index] = new Array();
	    	        	}
	    	        });
	    	       /* if( data0.collection[0].D){
	    	        	var dhzf = true;
		    	        data["D"] = new Array();
		    	        data["H"] = new Array();
		    	        var coord = ["H", "D",  "Z", "F"];
		    	        
	    	        }else{
	    	        	var dhzf = false;
	    	        	data["X"] = new Array();
                        data["Y"] = new Array();
                        var coord = ["X", "Y",  "Z", "F"]
	    	        }
	    	        data["Z"] = new Array();
                    data["F"]= new Array();*/
	    	        //traitement des collections
	    	
	    	        data0.collection.forEach( function( item){
	    	            var date = Date.parse(item.DATE+" "+item.TIME);
	    	            coord.forEach( function(index){
	    	            	data[index].push([date, item[index]]);
	    	            });
/*
	                        data["D"].push( [date , item.D]);
	                        data["H"].push( [date , item.H]);
	    	            }else{
	    	            	data["X"].push( [date , item.X]);
	    	                data["Y"].push( [date , item.Y]);
                        }
	    	            data["Z"].push( [date , item.Z]);
	    	            data["F"].push([date , item.F]);*/
	    	        });
	
	    	        coord.forEach( function(value, key){
	    	           // console.log(value);
	    	        var divchart = document.createElement("div");
	    	        divchart.classname = "chart";
	    	        container.appendChild(divchart);
	    	        parentContainer.style.display= 'block';
	    	        var mychart = Highcharts.chart(divchart, {
	    	            /*chart: {
	    	                type: 'linear'
	    	            },*/
	    	            chart:{
	    	            height:130,
	    	            marginBottom: (value==="F")? 45 : 15
	    	            },
	    	            title: {
	    	                text: '<div style="background:#fff;padding:5px;font-size:10px"><div style="background:'+Highcharts.getOptions().colors[key]+';width:10px;height:10px;display:inline-block;margin:0 3px;"></div>'+value+'</div>',
	    	                align: 'right',
	    	                margin: 10,
	    	                useHTML: true,
	    	              //  x: 70,
	    	                floating:true
	    	            },
	    	            xAxis: {
	    	                type: 'datetime',
	    	                lineColor:'#666',
	    	                tickLength: 5,
	    	                dateTimeLabelFormats: { // don't display the dummy year
	    	                   millisecond: '%H:%M:%S.%L',
	    	                    second: '%H:%M:%S',
	    	                    minute: '%H:%M',
	    	                    hour: '%H:%M',
	    	                    day: '%e %b %Y',
	    	                    week: '%e. %b',
	    	                    month: '%b %y',
	    	                    year: '%Y'
	    	                },
	    	                events: {
	    	                    setExtremes: syncExtremes
	    	                },
	    	                crosshair: true,
	    	                labels:{
	    	                    enabled:value==="F"
	    	                }
	    	            },
	    	            yAxis: [{
	    	                title: {
	    	                    text: "",
	    	                    margin:10,
	    	                    lineColor:'#666'
	    	                },
	    	                labels:{
	    	                    style:{
	    	                        color:'#333',
	    	                        fontSize:'10px'
	    	                    }
	    	                }}
	    	                /*{title: {
	    	                    text:'F'
	    	                }},
	    	                {title:{
	    	                    text: 'H',
	    	                }},
	    	                {title:{
	    	                    text: 'Z',
	    	                },
	    	                opposite:true}*/
	    	            ],
	    	            tooltip: {
	    	                headerFormat: '<b>{series.name}</b><br>',
	    	               // pointFormat: '{point.x:%e. %b %Y}: {point.y:,.0f}'
	    	                pointFormat: '{point.x:'+interval+'} | {point.y:,.0f}'
	    	            },
	    	            series: [{
	    	                name: value,
	    	                showInLegend:false,
	    	                color: Highcharts.getOptions().colors[key],
	    	                data: data[value] //[1, 0, 4]
	    	            }]/*,{
	    	                 name: "1",
	    	                 data: yaxis1 
	    	            },{
	    	                 name: "2",
	    	                 data: yaxis2 
	    	            },{
	    	                 name: "3",
	    	                 data: yaxis3 
	    	            }]*/
	    	        });
	    	    });
	    	       // Highcharts.charts.push( mychart);
	    	  //  }
	    	 
	     },
	     displayInfo( event){
	    	 console.log( event);
	    	 var options = event.detail.marker.options;
	    	 var observation = event.detail.observation;
	    	 //console.log(options);
	    	 if( this.code == options.title){
	    		 this.hide();
	    		 return;
	    	 }
	    	 this.close();
	    	 if(this.code = ""){
	    		 this.code = options.name;
	    		 this.open(observation);
               
               //  setTimeout( next, 0);
	    	 }else if( this.code != options.name){
	            this.code = options.name;
	            
	            var _self = this;
	           var next = function(){ 
	        	   _self.open(observation);
	                 }
	             setTimeout( next, 300);
	    	 }
	    	
	    	 
	    	 
	    	 
	     }
		
	},
	created(){
		this.$i18n.locale = this.lang;
		moment.locale(this.lang);
		this.aerisThemeListener = this.handleTheme.bind(this) 
        document.addEventListener('aerisTheme', this.aerisThemeListener);
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
		   
        if(this.lang == "fr"){
           Highcharts.setOptions({
               lang: {
                   months: [
                       'Janvier', 'Février', 'Mars', 'Avril',
                       'Mai', 'Juin', 'Juillet', 'Août',
                       'Septembre', 'Octobre', 'Novembre', 'Décembre'
                   ],
                   weekdays: [
                       'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
                       'Jeudi', 'Vendredi', 'Samedi'
                   ],
                   shortMonths: ["Jan" , "Fév" , "Mar" , "Apr" , "Mai" , "Jun" , "Jul" , "Aut" , "Sep" , "Oct" , "Nov" , "Déc"]
               }
           });
        }
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
    background-color:#DD9946;
}
.formater-sheet-container #container{
    max-width:595px;
    margin:0 0 5px 5px;
    padding:3px;
    background:white;
    box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);

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
    .formater-sheet-container main h4::after{
        content:" :";
    }
    .formater-sheet-container main h4::first-letter{
        text-transform:uppercase;
    }
    .formater-sheet-container .formater-address{
       border-left:1px solid #999;
       padding-left:10px;
       margin-left:5px;
       font-size:0.9rem;
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