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
		<span @click="play()" class="geotiff-nav geotiff-play" v-if="selected==null"><i class="fa fa-play"></i></span>
		<div v-show="selected!=null">
		<span class="geotiff-nav-content">
			<span @click="goTo(first)"  class="geotiff-nav" v-if="first!=null && selected!=first" :title="index2strdate(first)"><i class="fa fa-angle-double-left"></i></span>
		</span>
		<span class="geotiff-nav-content">
			<span @click="previous()"  class="geotiff-nav simple" v-if="selected!=first"><i class="fa fa-angle-left"></i></span>
		</span>
		<div class="geotiff-file" v-for="(item, key) in list" :data-image="item.png" v-show="keys[selected]==key" >{{ date2str(item.date) }}
		<a :href="item.tiff" download >Download geotiff</a>
		</div>
		<span class="geotiff-nav-content">
			<span @click="next()" class="geotiff-nav simple"  v-if="selected!=last"><i class="fa fa-angle-right"></i></span>
		</span>
		<span class="geotiff-nav-content">
			<span @click="goTo(last)"  class="geotiff-nav" v-if="last && selected!=last" :title="index2strdate(last)"><i class="fa fa-angle-double-right"></i></span>
		</span>
		</div>
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
        	default:null
        }
    },
    data(){
        return {
         	bbox:null,
         	selected:null,
         	first:null,
         	last:null,
         	nextImageListener:null,
         	closeSheetListener:null,
         	keys:[]
        }
    },
    computed: {
    	list(){
    		
    		
    		if( this.images != null){
    			var list = JSON.parse( this.images.replace(/'/g, '"'));
    			if( list.bbox)
	    		this.bbox = list.bbox;
	    		if( list.result){
		    		this.keys = Object.keys(list.result);
		    		this.first = 0;
		    		this.last = this.keys.length-1;
		    		
		    		return list.result;
	    		}else{
	    			return [];
	    		}
    		}else{
    			return [];
    		}
    	}
    },
    destroyed: function() {
//     	 document.removeEventListener('aerisTheme', this.aerisThemeListener);
//          this.aerisThemeListener = null;
         
         
         document.removeEventListener('aerisResetEvent', this.resetEventListener);
         this.resetEventListener = null;
         document.removeEventListener('closeSheet', this.closeSheetListener);
         this.closeSheetListener = null;
         document.removeEventListener('nextImageEvent', this.nextImageListener);
         this.nextImageListener = null;
		
  },
  
  created: function () {
	  
		this.$i18n.locale = this.lang;
		this.nextImageListener = this.next.bind(this) 
		document.addEventListener('nextImageEvent', this.nextImageListener);
		this.closeSheetListener = this.handleReset.bind(this);
		document.addEventListener('closeSheet', this.closeSheetListener);
		this.resetEventListener = this.handleReset.bind(this) ;
		document.addEventListener('aerisResetEvent', this.resetEventListener);

// 		this.aerisThemeListener = this.handleTheme.bind(this) 
// 	    document.addEventListener('aerisTheme', this.aerisThemeListener);
  },

  mounted: function(){
	
	 // console.log(this.images.bbox);
	 // console.log(this.images.result);
      var event = new CustomEvent('aerisThemeRequest', {});
      document.dispatchEvent(event);

  },
    methods:{
        
  		date2str( date){
  			return moment(date).format("ll");
  		},
  		index2strdate( index){
  			 if( index && this.keys[index] && this.list[this.keys[index]]){
  				 return this.date2str( this.list[ this.keys[index]].date);
  			 }else{
  				 return "";
  			 }
  		},
  		next(){
  			console.log( "click next");
  			this.selected += 1;
  			if( this.selected < this.keys.length){
  				this.triggerImageDisplay( this.keys[this.selected]);
  			}else{
  				this.selected = null;
  			}
  		},
  		previous(){
  			this.selected -=1;
  			if( this.selected < 0 ){
  				this.selected = null;
  			}else{
  				this.triggerImageDisplay( this.keys[this.selected]);
  			}
  		},
  		goTo( index){
  		
  			this.selected = index;
  			this.triggerImageDisplay( this.keys[index]);
  		},
  		play(){
  			this.selected = this.first -1;
  			this.next();
  		},
  		triggerImageDisplay( index){
  			if( typeof this.list[index] == "undefined"){
  				console.log( "undefined");
  				return;
  			}
  			var info = { bbox: this.bbox, img:this.list[index].png, date: this.date2str( this.list[index].date)};
  			var evt = new CustomEvent("selectedImage", {detail: info});
  			document.dispatchEvent(evt);
  			
  		},
		handleReset: function( ) {
			this.selected = null;
         	this.first= null;
         	this.last  = null;
         	this.keys =[];
		
			  
		},
		
		
//         handleTheme: function(theme) {
// 	  		this.theme = theme.detail;
// 			this.ensureTheme();
// 	 	 },
	  	
// 		 ensureTheme: function() {
// 		  	if ((this.$el) && (this.$el.querySelector)) {
// 		  		var color3 =  this.$shadeColor( this.theme.primary, 0.8);
		  		
		  		
// 		  	}
// 		 }
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
   border-radius:20px;
   font-weight:700;
   width:30px;
   vertical-align:middle;
   padding:2px 12px;
   opacity:0.3;
   font-size:2rem;
   cursor:pointer;
}
.geotiff-visualizer .geotiff-nav.simple{
   padding:2px 15px;
}
.geotiff-visualizer .geotiff-play{
	padding: 2px 6px 2px 10px;
}
.geotiff-nav-content{
	min-width:50px;
}
 .geotiff-visualizer .geotiff-nav:hover{ 
	opacity:0.8;
} 
.geotiff-visualizer .geotiff-file{
	display:inline-block;
	border:1px solid rgba(0,0,0,.24);
	padding: 10px;
	vertical-align:middle;
	box-shadow: 0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);
}
.geotiff-visualizer .geotiff-file a{
	display:block;
	margin-top:10px;
}
</style>
