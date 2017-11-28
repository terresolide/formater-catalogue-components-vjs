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
spatial search
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
