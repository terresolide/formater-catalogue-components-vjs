<i18n>
{
   "en":{
   },
   "fr":{
   }
}
</i18n>
<template>
<span>
<aeris-notifier autoHide="true"></aeris-notifier>
<formater-layout >
	
  
	<div class="formater-wrapper">
	
		<aside>
			<formater-form :lang="lang" :url="url"></formater-form>
			
			
		</aside>
		<main>
			<formater-map :lang="lang"></formater-map>
		</main>
  	</div>
	<footer>
	</footer>
	</formater-layout>
	
	</span>
</template>
<script>


 
export default {
    props:{
        lang: {
            type:String,
            default:'fr'
        },
        url:{
        	type:String,
        	default: 'http://api.formater/api'
        }
    },
    created(){
        this.$i18n.locale = this.lang;
    },
    mounted(){
    	
    }
}
</script>
