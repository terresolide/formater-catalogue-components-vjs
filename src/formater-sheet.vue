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
        "alternate contact": "Alternate Contact"
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
        "alternate contact": "Autre Contact"
   }
}
</i18n><template>
	<span class="formater-sheet-container" :class="hidden ? 'hidden' : ''" >
		<header class="formater-sheet-header" >
		  <h3>{{ title }}</h3>
		  <span class="fa fa-close" @click="close"></span>
		</header>
		<main class="formater-sheet-main">
		<div class="formater-sheet-data-metablock" v-if="data && data.data.description">
			<h4>
			<i class="fa fa-comment-o"></i>
			{{ $t("description")}}
			</h4>
			<main v-html="data.data.description[lang]">
			
			</main>
		</div>
		<div class="formater-sheet-data-metablock-50" style="float:right;" v-if="data && data.data.quicklook">
           
            <main>
            <div v-for="image in data.data.quicklook">
             <img :src="image.url" alt=":image.description" />
            </div>
            
            </main>
        </div>
		<div class="formater-sheet-data-metablock-50" v-if="data && data.data.contacts">
            <h4>
            <i class="fa fa-users"></i>
            {{ $t("contacts")}}
            </h4>
            <main>
           
            <div v-for="contact in data.data.contacts">
                <div class="formater-function">{{ $t(contact.roles[0])}}</div>
                <i class="fa fa-user"></i>
                {{ $t(contact.name)}}
            </div>
            <div id="container"></div>
     
            </main>
        </div>
		
		</main>
	</span>
</template>
<script>

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
			console.log("watch");
			if(this.$el && this.$el.querySelector ){
				var header = this.$el.querySelector(".formater-sheet-header").offsetHeight;
				this.$el.querySelector(".formater-sheet-main").style.maxHeight = newVal +"px";
			}
			return newVal;
		}
	},
	data(){
		return {
			title: 'le titre',
			theme: '',
			aerisThemeListener:null,
			displayInfoListener:null,
			findDataListener:null,
			unselectLayerListener:null,
			hidden: true,
			code: null,
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
	        if ((this.$el) && (this.$el.querySelector)) {
	        	var color = this.theme.primary;
	            var color3 =  this.$shadeColor( this.theme.primary, 0.8);
	            var nodes= this.$el.querySelectorAll("header");
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
	    	 this.hidden = true;
	    	 this.code ="";
	     },
	    
	     open(){
	    	 this.hidden = false;
	     },
	     createTextNode( key, text){
	    	 switch(key){
	    	 case "url":
	    		 var node = document.createElement("a");
	    		 node.setAttribute("href", text);
	    		 node.appendChild( document.createTextNode(text));
	    		 break;
	         default:
	        	 var node =  document.createTextNode(text);
	    	 }
	    	 return node;
	     },
	     handleCreateChart(event){
	    	 if(this.$el.querySelector && this.$el.querySelector("#chartContainer")){
                 return;
             }
	    	 var data0 = event.detail.marker.options.data.data;
	    	 this.createChart( data0);
	     },
	     destroyCharts(){
	    	console.log( Highcharts.charts); 
	    	 for (var i = 0; i < Highcharts.charts.length; i = i + 1) {
	    		 if( typeof Highcharts.charts[i] != "undefined")
	    		 Highcharts.charts[i].destroy();
	    	 }
	    	
	    	 //remove container
	    	 var el = this.$el.querySelector("#chartContainer");
	    	 if(el)  el.parentNode.removeChild( el );
	     },
	     createChart(data0){
	    	 console.log(data0)
	    	 console.log("createChart");
	    	
	    	 var container = this.$el.querySelector("#chartContainer");
	    	 if(!container){
		    	 var node = this.$el.querySelector("main");
		    	 var container = document.createElement("div");
		    	 node.appendChild( container );
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
	    	if(this.code != code){
	    		return;
	    	}
	    	       
	    	        var data = new Array();
	    	        data["D"] = new Array();
	    	        data["H"] = new Array();
	    	        data["Z"] = new Array();
	    	        data["F"]= new Array();
	    	        //traitement des collections
	    	
	    	        data0.collection.forEach( function( item){
	    	            var date = Date.parse(item.DATE+" "+item.TIME);
	    	            data["D"].push( [date , item.D]);
	    	            data["H"].push( [date , item.H]);
	    	            data["Z"].push( [date , item.Z]);
	    	            data["F"].push([date , item.F]);
	    	        });
	
	    	        ["D", "H", "Z", "F"].forEach( function(value, key){
	    	            console.log(value);
	    	        var divchart = document.createElement("div");
	    	        divchart.classname = "chart";
	    	        container.appendChild(divchart);
	    	   
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
	    	                pointFormat: '{point.x:%e. %b %Y}: {point.y:,.0f}'
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
	     object2dom( data ){
	    	 this.title = data.title;
	    	 var node = this.$el.querySelector("main");
	    	 node.innerHTML = "";
	    	 for(var key in data.data){
	    		 var div = document.createElement("div");
	    		 node.appendChild(div);
	    		 var title = document.createElement("h4");
	    		 title.appendChild( document.createTextNode(this.$i18n.t(key)));
	    		 div.appendChild(title);
	    		 console.log(typeof data.data[key]);
	    		 switch(typeof data.data[key]){
	    		 case "string":
	    			 var span = document.createElement("span");
	    			 var textNode = this.createTextNode( key, data.data[key]);
	    			 
	    			 span.appendChild( textNode);
	    			 div.appendChild( span);
	    			 break;	 
	    		 
	    		 case "object":
	    			 if(data.data[key][this.lang]){
	    				 var span = document.createElement("span");
	    				 var textNode = this.createTextNode( key, data.data[key][this.lang]);
	                     span.appendChild( textNode);
	                     div.appendChild( span);
	    			 }else if(data.data.data){
	    				 this.createChart(data.data.data);
	    				 
	    			 }
	    			 default:
	    				 
	    		 }
	    	 }
	    	 
	    	 
	     },
	     displayInfo( event){
	    	 
	    	 var options = event.detail.marker.options;
	    	 console.log(options);
	    	 if( this.code == options.name){
	    		 this.hide();
	    		 return;
	    	 }
	    	 this.close();
	    	 if(this.code = ""){
	    		 this.code = options.name;
	    		 var _self = this;
                // var next = function(){ 
                    // _self.object2dom(options);
                     _self.title = options.title;
                     _self.data = options;
                     _self.hidden = false;
                     if(options.data.data)
                     this.createChart(options.data.data);//}
               //  setTimeout( next, 0);
	    	 }else if( this.code != options.name){
	    		 //this.title = event.detail.options.title;
	            // this.hidden = false;
	            this.code = options.name;
	            this.data = options;
	            var _self = this;
	           var next = function(){ 
	        	   console.log(options.data);
	            	// _self.object2dom(options);
	            	 _self.title = options.title;
	            	 _self.hidden = false;
	            	 if(options.data.data)
	            	 _self.createChart(options.data.data);}
	             setTimeout( next, 300);
	    	 }
	    	
	    	 
	    	 
	    	 
	     }
		
	},
	created(){
		this.$i18n.locale = this.lang;
		this.aerisThemeListener = this.handleTheme.bind(this) 
        document.addEventListener('aerisTheme', this.aerisThemeListener);
		this.displayInfoListener = this.displayInfo.bind(this) 
        document.addEventListener('displayInfo', this.displayInfoListener);
		this.findDataListener = this.handleCreateChart.bind(this) 
        document.addEventListener('findData', this.findDataListener);
		this.unselectLayerListener = this.hide.bind(this);
		document.addEventListener('unselectLayer', this.unselectLayerListener);
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
		 document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener = null;
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
.formater-sheet-container #chartContainer{
    width:95%;
    margin:auto;
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
    .formater-sheet-container main{
    margin: 0 5px;
    overflow-y:auto;
   /* max-height:300px;*/
    }
    .formater-sheet-container main h4{
        
        color:#000;
        display:inline-block;
        margin: 3px;
    }
  
    .formater-sheet-data-metablock-50{
        width:289px;
        float:left;
        padding:3px;
        border-radius:2px;
        box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);
    }
    .formater-sheet-container main h4::after{
        content:" :";
    }
    .formater-sheet-container main h4::first-letter{
        text-transform:uppercase;
    }
</style>