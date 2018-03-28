require("exports-loader?!./l.min.js")
//test git name
import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);

//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import FormaterSpatialSearch from './formater-spatial-search.vue';
import FormaterForm from './formater-form.vue';
import FormaterMap from './formater-map.vue';
import FormaterCatalogue from './formater-catalogue.vue';
import GeotiffVisualizer from './geotiff-visualizer.vue';
import FormaterSheet from './formater-sheet.vue';
//@todo use aeris-mixins instead of isgi-tools.js
/*import IsgiTools from './isgi-tools.js';
Vue.use(IsgiTools);*/
const formaterPlugin = {
        install(Vue, options) {
            Vue.prototype.$shadeColor= function(color, percent) {  
                     var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
                     // return "red";
                     return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
            }
            
        }
};

Vue.use( formaterPlugin);





ljs.addAliases({
	dep: [
		//icon marker with font awesome CSS
		//-----------------------------
	    'https://rawgit.com/epointal/lf-hiker/master/lib/awesome-marker/leaflet.awesome-markers.css',
	    //leaflet
		//------------
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css',
	   // 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.js',
	    
		// composants formater de bases
		//-----------------------------
	    //'https://rawgit.com/terresolide/formater-commons-components-vjs/master/dist0/formater-commons-components-vjs.js' ,
	   // 'https://cdn.rawgit.com/terresolide/formater-commons-components-vjs/0.1.6/dist/formater-commons-components-vjs.js' ,
	    "https://api.poleterresolide.fr/webcomponents/formater-commons-components-vjs_0.1.6.js"   
	    
	    ]
})
ljs.load('dep', function() {
	
 // le tableau des composants Aeris
    if (!window.registredAerisElements) {
        window.registredAerisElements = [];
    }
    
    function registerElement(name, component) {
       
        if (window.registredAerisElements.indexOf(name) < 0) {
            Vue.customElement(name, component);
            window.registredAerisElements.push(name)
        }
    }
    var componentUsed = [];
    var componentUsed = new Array('formater-select','formater-layout', 'aeris-datepicker', 'aeris-notifier');
   // var componentUsed = new Array( 'aeris-datepicker');
    var loaded = setInterval(function() {
        var result = componentUsed.filter( function( cpt){
            return window.registredAerisElements.indexOf(cpt)>-1;
        });
        
        if ( result.length == componentUsed.length ) {
           console.log("Formater Catalogue:  before components loaded");
           load();
           clearInterval(loaded);
        }
     }, 100);
     function load(){
         registerElement('formater-spatial-search', FormaterSpatialSearch);
         registerElement('formater-form', FormaterForm);
         registerElement('geotiff-visualizer', GeotiffVisualizer);
         registerElement('formater-sheet', FormaterSheet);
         registerElement('formater-map', FormaterMap);
         registerElement('formater-catalogue', FormaterCatalogue);
         

   
    
    }
	
})

