<i18n>
{
   "en":{
        "organism":    "organism",
        "code": "code",
        "name": "name",
        "country": "country",
        "temporal": "temporal",
        "url": "url"
   },
   "fr":{
         "organism":    "organisme",
         "code": "code",
        "name": "nom",
        "country": "pays",
        "temporal": "intervalle de temps",
        "url": "url"
   }
}
</i18n><template>
	<span class="formater-sheet-container" :class="hidden ? 'hidden' : ''">
		<header>
		  <h3>{{ title }}</h3>
		  <span class="fa fa-close" @click="close"></span>
		</header>
		<main>
		</main>
	</span>
</template>
<script>
export default {
	props: {
		 lang: {
	          type: String,
	          default: 'fr'
	      }
	},
	data(){
		return {
			title: 'le titre',
			theme: '',
			aerisThemeListener:null,
			displayInfoListener:null,
			hidden: true,
			code: null
			
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
	    			 }else{
	    				 
	    			 }
	    			 default:
	    				 
	    		 }
	    	 }
	    	 
	    	 
	     },
	     displayInfo( event){
	    	 console.log(event.detail.options.title);
	    	 if( this.code == event.detail.options.name){
	    		 this.close();
	    		 return;
	    	 }
	    	 this.close();
	    	 if(this.code = ""){
	    		 this.code = event.detail.options.name;
	    		 var _self = this;
                // var next = function(){ 
                     _self.object2dom(event.detail.options);
                     _self.title = event.detail.options.title;
                     _self.hidden = false;//}
               //  setTimeout( next, 0);
	    	 }else if( this.code != event.detail.options.name){
	    		 //this.title = event.detail.options.title;
	            // this.hidden = false;
	            this.code = event.detail.options.name;
	            var _self = this;
	             var next = function(){ 
	            	 _self.object2dom(event.detail.options);
	            	 _self.title = event.detail.options.title;
	            	 _self.hidden = false;}
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
	},
	mounted(){
		var event = new CustomEvent('aerisThemeRequest', {});
	     document.dispatchEvent(event);
	},
	destroyed(){
		 document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener = null;
         document.removeEventListener('displayInfo', this.displayInfoListener);
         this.displayInfoListener = null;
	}
}
</script>
<style>
.formater-sheet-container{
    position:absolute;
    top:20px;
    right:0;
    background-color:#fff;
    width:300px;
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
    -ms-transform: translateX(310px);
    -webkit-transform: translateX(310px);
    -moz-transform: translateX(310px);
    -o-transform: translateX(310px);
    transform: translate(310px);
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
.formater-sheet-container header h3{
    display:inline-block;
    margin:0;
    max-width:275px;
   }
    .formater-sheet-container header span.fa-close{
        float:right;
        cursor:pointer;
    }
    .formater-sheet-container main{
    margin: 0 5px;
    }
    .formater-sheet-container main h4{
        color:#000;
        display:inline-block;
        margin: 3px;
    }
    .formater-sheet-container main h4::after{
        content:" :";
    }
    .formater-sheet-container main h4::first-letter{
        text-transform:uppercase;
    }
</style>