/**
 *  Drawing graph
 */
var Highcharts = require("highcharts");


var Bcmt = require("./bcmt-chart.js");
var bcmt = new Bcmt(Highcharts);
var Isgi = require("../../isgi-component-vjs/src/isgi-indice-module.js");
var isgi = new Isgi(Highcharts);


function FtChart(Highcharts){
	
	/**
	 * Override the reset function, we don't need to hide the tooltips and crosshairs.
	 */
	Highcharts.Pointer.prototype.reset = function () {
	    return undefined;
	};

	/**
	 * Highlight a point by showing tooltip, setting hover state and draw crosshair
	 */
	Highcharts.Point.prototype.highlight = function (event) {
	    this.onMouseOver(); // Show the hover marker
	    this.series.chart.tooltip.refresh(this); // Show the tooltip
	    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
	};

	/** public **/
	this.container = null;
	this.code = null;
	this.data = null;
	
	/** private **/
	var _lang = "en";
	

	var _translation = {
			data: {
				fr: "Données",
				en: "Data"
			},
			from:{
				fr: "du",
				en: "from"
			},
			to:{
				fr: "au",
				en: "to"
			}
	}
	
	function _t( name){
		if(!_translation[name] || ! _translation[name][_lang]){
			return name;
		}else{
			return _translation[name][_lang];
		}
		
	}

	
	 /** public method **/
	 this.init = function( lang){
		 _lang =lang;
	
		 if(lang == "fr"){
	           Highcharts.setOptions({
	               lang: {
	                   months: [
	                       'Janvier', 'Février', 'Mars', 'Avril',
	                       'Mai', 'Juin', 'Juillet', 'Août',
	                       'Septembre', 'Octobre', 'Novembre', 'Décembre'
	                   ],
	                   weekdays: [
	                       'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
	                       'Jeudi', 'Vendredi', 'Samedi'
	                   ],
	                   shortMonths: ["Jan" , "Fév" , "Mar" , "Apr" , "Mai" , "Jun" , "Jul" , "Aut" , "Sep" , "Oct" , "Nov" , "Déc"]
	               }
	           });
	        }
	 }
	 this.createChartTitle =  function(  ){
    	 
		 var dataType = this.data.meta.get("Data Type");
		 var interval = bcmt.intervalType( this.data.meta.get("Data Interval Type"), dataType);
	     var begin= this.data.collection[0].DATE;
	     var end = this.data.collection[ this.data.collection.length-1].DATE
//          this.createChartTitle( dataType, data0.collection[0].DATE, data0.collection[ data0.collection.length-1].DATE);
	    	 var chartTitle = _t("data") +" &quot;"+dataType + "&quot; "+ _t("from")+" "+ moment(begin, "YYYY-MM-DD").format("ll");
	            if(end != begin){
	                chartTitle += " " + _t("to")+ " "+ moment(end, "YYYY-MM-DD").format("ll");
	            }
	    	 return chartTitle;
	 }
	 this.destroyCharts = function(){
		  
		    if(! this.container ) return false;
		   // _removeListeners();
	    	 for (var i = 0; i < Highcharts.charts.length; i++) {
	    		 if( typeof Highcharts.charts[i] != "undefined")
	    		 Highcharts.charts[i].destroy();
	    	 }
	    	
	    	 //remove all in container
	    	 while (this.container.firstChild) {
	    		
	    		    this.container.removeChild(this.container.firstChild);
	    		}
	    	
	    	return true;
	 }
     this.createChart= function(container, cds, data0, code, query){
	    	
	     if(!data0 || !data0.collection){
	    	 return false
	     }
    	 this.code = code;
    	 this.data = data0;
    	 this.cds = cds;
    	 if( data0.collection.length == 0 ){
    		 this.hasChart = false;
      		return false;
      	}
    	 // specifique isgi et bcmt!!
    	 var datacode = data0.meta.get("IAGA Code");
    	 console.log( this.code);
    	 console.log( datacode);
     	 if( this.cds == "bcmt"){
     		var dataType = data0.meta.get("Data Type");
     		if(dataType)
     		 datacode += "-"+ dataType.toUpperCase();
     		 if(  this.code != datacode ){

        		 return false;
        	 }
     	 }
    	
    	 	
    	this.container = container;
  	 	
    	var hasChart = false;
	    
	    switch( this.cds){
	    case "bcmt":
	    	hasChart = bcmt.createChart( container, data0);
	    	break;
	    case "isgi":

	    	var collection = new isgi.Collection({result:data0, query:query}, code, code, _lang);
	    	hasChart = collection.createChart( container, 580);
	    	break;
	    }
	    this.hasChart = hasChart;
	    return hasChart;

    	 
     }
	     
}

module.exports = new FtChart(Highcharts);