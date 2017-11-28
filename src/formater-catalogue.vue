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
<formater-layout >
		<header>
	<h2>Catalogue des données</h2>

	</header>
  
	<div class="formater-wrapper">
	
		<aside>
			<formater-form :lang="lang"></formater-form>
			
			
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
        }
    },
    created(){
        this.$i18n.locale = this.lang;
    }
}
</script>
