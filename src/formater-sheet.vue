<template>
	<span class="formater-sheet-container">
		<header><h3>{{ title }}</h3></header>
		<main>
		</main>
	</span>
</template>
<script>
export default {
	props: {
		
	},
	data(){
		return {
			title: 'le titre',
			theme: '',
			aerisThemeListener:null,
			displayInfoListener:null
			
		}
	},
	methods:{
		   handleTheme: function(theme) {
	            this.theme = theme.detail;
	            this.ensureTheme();
	      },
	        
	     ensureTheme: function() {
	        if ((this.$el) && (this.$el.querySelector)) {
	        	var color = this.theme.primary;
	            var color3 =  this.$shadeColor( this.theme.primary, 0.8);
	            var nodes= this.$el.querySelectorAll("header h3");
	            [].forEach.call(nodes, function(node){
	            	console.log("node");
	                node.style.backgroundColor = color;
	            })
	            
	        }
	     }
		
	},
	created(){
		this.aerisThemeListener = this.handleTheme.bind(this) 
        document.addEventListener('aerisTheme', this.aerisThemeListener);
	},
	mounted(){
		
	},
	destroyed(){
		 document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener = null;
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
    transform: translate(300px, 0);
    z-index:450;
}
</style>