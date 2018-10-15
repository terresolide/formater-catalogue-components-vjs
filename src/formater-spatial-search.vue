<i18n>
{
   "en":{
     "north_symbol": "N",
     "east_symbol": "E",
     "south_symbol": "S",
     "west_symbol": "W",
     "reset":	"Reset",
     "draw": "Draw"
     
   },
   "fr":{
     "north_symbol": "N",
     "east_symbol": "E",
     "south_symbol": "S",
     "west_symbol": "O",
     "reset": "Initialiser",
     "draw": "Dessiner"
   }
}
</i18n>
<template>
<span class="formater-spatial-search">
	<div class="box-toolbar">
	   <button class="spatial-edit-button" :title="$t('draw')" @click="handleDraw"><i class="fa fa-pencil-square-o"></i></button>
	   <button class="spatial-reset-button" :title="$t('reset')" @click="handleReset"><i class="fa fa-remove"></i></button>
	</div>
	<div class="formater-spatial-search-content">
		<div class="formater-input-group cardinal-center">
			<span class="right">{{$t('north_symbol')}}</span>
			<input    v-model="north" :pattern="patternLatitude" @click="handleChange"></input>
		</div>
		<div class="formater-input-group cardinal-left">
			<span class="right">{{$t('west_symbol')}}</span>
			<input   v-model="west" :pattern="patternLongitude" @click="handleChange"></input>
		</div>
		<div class="formater-input-group cardinal-right">
			
			<input   v-model="east" :pattern="patternLongitude" @click="handleChange"></input>
			<span class="left">{{$t('east_symbol')}}</span>
		</div>
		
		<div class="formater-input-group cardinal-center">
			<span class="right">{{$t('south_symbol')}}</span>
			<input  v-model="south" :pattern="patternLatitude" @click="handleChange"></input>
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
        }
    },
    data(){
        return {
            north: "",
            south: "",
            east: "",
            west: "",
            areaSelect: false,
            searchEventListener: null,
       		resetEventListener: null,
       		aerisThemeListener:null,
       		patternLatitude: "[-+]?[0-9]{1,2}([.][0-9]+)?",
        	patternLongitude:"[-+]?(180(\.0+)?|((1[0-7][0-9])|([1-9]?[0-9]))([.][0-9]+)?)"
        }
    },
    destroyed: function() {
		document.removeEventListener('aerisResetEvent', this.resetEventListener);
		this.resetEventListener = null;
		document.removeEventListener('aerisSearchEvent', this.searchEventListener);
		this.searchEventListener = null;
		 document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener = null;
  },
  
  created: function () {
		this.$i18n.locale = this.lang;
		this.resetEventListener = this.handleReset.bind(this) 
		document.addEventListener('aerisResetEvent', this.resetEventListener);
		this.searchEventListener = this.handleSearch.bind(this) 
		document.addEventListener('aerisSearchEvent', this.searchEventListener);
		this.aerisThemeListener = this.handleTheme.bind(this) 
	    document.addEventListener('aerisTheme', this.aerisThemeListener);
		this.selectAreaChangeListener = this.handleBounds.bind(this) 
	    document.addEventListener('selectAreaChange', this.selectAreaChangeListener);
  },

  mounted: function(){
      var event = new CustomEvent('aerisThemeRequest', {});
      document.dispatchEvent(event);

  },
    methods:{
        bbox: function(){
            return {
	            north: this.north,
	            south: this.south,
	            east: this.east,
	            west: this.west
	            }
    	},
        handleChange: function(e){
        	this.areaSelect = false;
             var event = new CustomEvent( 'selectAreaDrawEnd', { detail:this.bbox()});
       	    document.dispatchEvent( event);
            return;
    	},
    	handleDraw:function(){ 
    	   if(this.areaSelect){
    	       var event = new CustomEvent( 'selectAreaDrawEnd', {detail: this.bbox()});
          	   
    	   }else{
    		   var event = new CustomEvent( 'selectAreaDrawStart', {detail: this.bbox()});
    	   }  
    	   this.areaSelect = !this.areaSelect;
    	   document.dispatchEvent( event);
    	 
    	    return;
    	},
  
		handleReset: function( ) {
		   
			 this.north = "";
			 this.east = "";
			 this.west = "";
			 this.south = "";
			 if(this.areaSelect){
	  	       this.areaSelect = false;
		      
			 }
			 var event = new CustomEvent( 'selectAreaDrawEnd', { detail: this.bbox()});
		       document.dispatchEvent( event);

			  
		},
		handleBounds: function(e){
		    this.north = e.detail.north;
		    this.south = e.detail.south;
		    this.east = e.detail.east;
		    this.west = e.detail.west;
		},
	
		handleSearch: function(e) {
			
		    e.detail.box = this.bbox();
		    this.handleChange();
	    },
        handleTheme: function(theme) {
	  		this.theme = theme.detail;
			this.ensureTheme();
	 	 },
	  	
		 ensureTheme: function() {
		  	if ((this.$el) && (this.$el.querySelector)) {
		  		var color3 =  this.$shadeColor( this.theme.primary, 0.8);
		  		var nodes= this.$el.querySelectorAll(".formater-input-group");
		  		[].forEach.call(nodes, function(node){
		  		    node.style.backgroundColor = color3;
		  		})
		  		
		  	}
		 }
    }
}
</script>
<style>
.formater-spatial-search .formater-input-group {
    border: none;
    display:inline-block;
     /* Default color from aeris */
    background-color: rgba(172,220,238,0.3); 
}

.formater-spatial-search .formater-input-group input {
	border: none;
	background-color: transparent;
	padding: 0 5px;
	outline: none;
}
	
.formater-spatial-search .formater-input-group span:first-letter {
   text-transform: uppercase;
}
.formater-spatial-search .formater-input-group{
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 5px 0;
    width: 48%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
}
.formater-spatial-search .formater-input-group input{
  min-width: 80px;
  max-width: 90px;
  text-align:center;
  padding: 0 3px;
  margin: 0 3px;
}
.formater-spatial-search .formater-input-group.cardinal-left{
   float:left;
}
.formater-spatial-search .formater-input-group.cardinal-right{
   float:right;
}
.formater-spatial-search .formater-input-group.cardinal-left input{
   text-align:left;
 }
.formater-spatial-search .formater-input-group.cardinal-right input{
   text-align:right;
   
 }
.formater-spatial-search .formater-input-group.cardinal-center{
   margin:auto;
   clear:both;
}
.formater-spatial-search .formater-input-group .right {
  min-width: 25px;
  border-right: 1px solid #fff;
  box-sizing: border-box;
  display: block;
  height: 100%;
  text-align: center;
}
.formater-spatial-search .formater-input-group .left {
  min-width: 25px;
  border-left: 1px solid #fff;
  box-sizing: border-box;
  display: block;
  height: 100%;
  text-align: center;
}
.formater-spatial-search .box-toolbar {
   text-align: right;
   display:block;
   margin: 0 0 10px 0;
}
.formater-spatial-search .box-toolbar button{
	margin-left:3px;
	min-width:15px;
}
</style>
