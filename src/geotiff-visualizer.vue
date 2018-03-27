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
        	type:String,
        	default:""
        }
    },
    data(){
        return {
         
        }
    },
    destroyed: function() {
		
  },
  
  created: function () {
		this.$i18n.locale = this.lang;
		this.resetEventListener = this.handleReset.bind(this) 
		document.addEventListener('aerisResetEvent', this.resetEventListener);

		this.aerisThemeListener = this.handleTheme.bind(this) 
	    document.addEventListener('aerisTheme', this.aerisThemeListener);
  },

  mounted: function(){
	  
	  console.log(this.images.bbox);
	  console.log(this.images.result);
      var event = new CustomEvent('aerisThemeRequest', {});
      document.dispatchEvent(event);

  },
    methods:{
        
  
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

</style>
