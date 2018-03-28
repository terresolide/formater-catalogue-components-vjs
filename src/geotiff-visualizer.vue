<i18n>
{
   "en":{
    
   },
   "fr":{
     
   }
}
</i18n>
<template>
<span class="geotiff-visualizer">
	<div>
	<span @click="previous()"  class="geotiff-nav" v-if="selected!=first"><i class="fa fa-chevron-left"></i></span>
	<span v-for="(item, key) in list" :data-image="item.png" v-show="keys[selected]==key" style="display:inline-block;">{{ date2str(item.date) }}</span>
	<span @click="next()" class="geotiff-nav"  v-if="selected!=last"><i class="fa fa-chevron-right"></i></span>
	</div>
</span>
</template>
<script>
export default {
    props:{
        lang: {
            type:String,
            default:'fr'
        },
        images:{
        	type:[String, Array, Object],
        	default:""
        }
    },
    data(){
        return {
         	bbox:null,
         	selected:null,
         	first:null,
         	last:null,
         	keys:[]
        }
    },
    computed: {
    	list(){
    		var list = JSON.parse( this.images.replace(/'/g, '"'));
    		this.bbox = list.bbox;
    		console.log( list.result);
    		this.keys = Object.keys(list.result);
    		this.first = 0;
    		this.last = this.keys.length-1;
    		this.selected = this.first;
    		return list.result;
    	}
    },
    destroyed: function() {
		
  },
  
  created: function () {
	  console.log( "dans created geotiff");
	  
		this.$i18n.locale = this.lang;
		this.resetEventListener = this.handleReset.bind(this) 
		document.addEventListener('aerisResetEvent', this.resetEventListener);

		this.aerisThemeListener = this.handleTheme.bind(this) 
	    document.addEventListener('aerisTheme', this.aerisThemeListener);
  },

  mounted: function(){
	  console.log( "dans mounted geotiff");
	  console.log(this.images.bbox);
	  console.log(this.images.result);
      var event = new CustomEvent('aerisThemeRequest', {});
      document.dispatchEvent(event);

  },
    methods:{
        
  		date2str( date){
  			return moment(date).format("ll");
  		},
  		next(){
  			this.selected += 1;
  		},
  		previous(){
  			this.selected -=1;
  		},
		handleReset: function( ) {
		   
		
			  
		},
		
		
        handleTheme: function(theme) {
	  		this.theme = theme.detail;
			this.ensureTheme();
	 	 },
	  	
		 ensureTheme: function() {
		  	if ((this.$el) && (this.$el.querySelector)) {
		  		var color3 =  this.$shadeColor( this.theme.primary, 0.8);
		  		
		  		
		  	}
		 }
    }
}
</script>
<style>
.geotiff-visualizer > div{
	margin:30px;
	text-align:center;
	
}

.geotiff-visualizer .geotiff-nav{
   background:black;
   color: white;
   width:30px;
   min-height:60px;
   padding:8px 12px;
   margin: 20px 5px;
   border-radius:15px;
   opacity:0.3;
   cursor:pointer;
}
 .geotiff-visualizer .geotiff-nav::hover{ 
	opacity:0.8;
} 
</style>
