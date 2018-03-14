/**
 *  Drawing graph
 */

function FtChart(){
	var Highcharts = require("highcharts");
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
	var _lang = "en";
	
	/** private **/
	var _mousemoveListener = null;
	var _touchstartListener = null;
	var _touchmoveListener = null;
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
	
	function _translate( name){
		if(!_translation[name]){
			return name;
		}else{
			return _translation[name][_lang];
		}
		
	}
	 function _intervalType( intervalType, dataType){
    	 if(dataType == "variation"){
    		 return "%e. %b %H:%M";
    	 }
    	 switch(intervalType){
    	 case "Filtered 1-minute":
    		 return "%e. %b %H:%M";
    	 case "1-day (01-24)":
    	 case "1-day (00-23)":
    		 return '%e. %b';
    	 case "1-hour (00-59)":
    		 return '%H:%M';
    	 case "1-month (01-31)":
    		 return '%e. %b %Y';
    	 case "1-year":
    		 return '%b %Y';
    	  default:
    		  return '%e. %b %Y';
    	 }
     }
	 function _addListeners( container){
		if(!container ) return;
		//this.container.onmousemove = _handle_global;
		_mousemoveListener = container.addEventListener("mousemove", _handle_global);
		_touchstartListener = container.addEventListener("touchstart", _handle_global);
		 _touchmoveListener = container.addEventListener("touchmove", _handle_global);
	 }
	 
	 function _removeListeners(){
		 if(! this.container) return;
		 this.container.removeEventListener("mousemove", _handle_global);
		 _mousemoveListener = null;
		 this.container.removeEventListener("touchstart", _handle_global);
		 _touchstartListener = null;
		 this.container.removeEventListener("touchmove", _handle_global);
		 _touchmoveListener = null;
	 }
	 function _handle_global(e){
		
	     var chart,
	        point,
	        i,
	        event;
	     //Highcharts.each(Highcharts.charts, function (chart) {
	    //	 console.log("chart");
	    // })
	    for (var i = 0; i < Highcharts.charts.length; i = i + 1) {
	   
	    	if( typeof Highcharts.charts[i] != "undefined"){
	    		
	        chart = Highcharts.charts[i];
	        event = chart.pointer.normalize(e); // Find coordinates within the chart
	       
	        point = chart.series[0].searchPoint(event, true); // Get the hovered point

	        if (point) {
	            point.highlight(e);
	        }
	    }
	    }
	}
	 
	
//	function _syncExtremes(e) {
//		    return;
//		    console.log(e);
//		    var thisChart = this.chart;
//		    
//		    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
//		        Highcharts.each(Highcharts.charts, function (chart) {
//		        	//console.log(chart);
//		            if (chart !== thisChart) {
//		                if (chart.xAxis[0].setExtremes) { // It is null while updating
//		                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
//		                }
//		            }
//		        });
//		    }
//		}
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
		 var interval = _intervalType( this.data.meta.get("Data Interval Type"), dataType);
	     var begin= this.data.collection[0].DATE;
	     var end = this.data.collection[ this.data.collection.length-1].DATE
//          this.createChartTitle( dataType, data0.collection[0].DATE, data0.collection[ data0.collection.length-1].DATE);
	    	 var chartTitle = _translate("data") +" &quot;"+dataType + "&quot; "+ _translate("from")+" "+ moment(begin, "YYYY-MM-DD").format("ll");
	            if(end != begin){
	                chartTitle += " " + _translate("to")+ " "+ moment(end, "YYYY-MM-DD").format("ll");
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
	     },
     this.createChart= function(container, code, data0){
	     if(!data0 || !data0.collection){
	    	 return false
	     }
    	 this.code = code;
    	 this.data = data0;
    	 

    	 var datacode = data0.meta.get("IAGA Code");
     	
     	if(this.code != datacode || data0.collection.length == 0 ){
     		return false;
     	}
    	 	
    	 //console.log(data0)
    	 //console.log("createChart");
    	  if(! _mousemoveListener){ 	 
    		  _addListeners(container);
	    	
    	 }
    	   // function createChart( data0) { 
    	       // console.log(data0);
    	  this.container = container;
  	 	
  	 	this.code = code;
    	var dataType = data0.meta.get("Data Type");
        var interval = _intervalType(data0.meta.get("Data Interval Type"), dataType);
       
       
    	       
	    var data = new Array();
	    var coord = new Array();
	    ["D", "H", "X", "Y",  "Z", "F"].forEach( function(index){
	    	if( data0.collection[0][index]){
	    		coord.push(index);
	    		data[index] = new Array();
	    	}
	    });
    	      
    	
        data0.collection.forEach( function( item){
            var date = Date.parse(item.DATE+" "+item.TIME);
            coord.forEach( function(index){
            	data[index].push([date, item[index]]);
            });

        });

    	        coord.forEach( function(value, key){
    	           // console.log(value);
    	        var divchart = document.createElement("div");
    	        divchart.classname = "chart";
    	        container.appendChild(divchart);
    	        
    	        var mychart = Highcharts.chart(divchart, {
    	            /*chart: {
    	                type: 'linear'
    	            },*/
    	            chart:{
    	            height:130,
    	            marginBottom: (value==="F")? 45 : 15
    	            },
    	            title: {
    	                text: '<div style="background:#fff;padding:5px;font-size:10px"><div style="background:'+Highcharts.getOptions().colors[key]+';width:10px;height:10px;display:inline-block;margin:0 3px;"></div>'+value+'</div>',
    	                align: 'right',
    	                margin: 10,
    	                useHTML: true,
    	              //  x: 70,
    	                floating:true
    	            },
    	            xAxis: {
    	                type: 'datetime',
    	                lineColor:'#666',
    	                tickLength: 5,
    	                dateTimeLabelFormats: { // don't display the dummy year
    	                   millisecond: '%H:%M:%S.%L',
    	                    second: '%H:%M:%S',
    	                    minute: '%H:%M',
    	                    hour: '%H:%M',
    	                    day: '%e %b %Y',
    	                    week: '%e. %b',
    	                    month: '%b %y',
    	                    year: '%Y'
    	                },
//    	                events: {
//    	                    setExtremes: function(e){
//    	                    	console.log(e);
//    	                    }
//    	                },
    	                crosshair: true,
    	                labels:{
    	                    enabled:value==="F"
    	                }
    	            },
    	            yAxis: [{
    	                title: {
    	                    text: "",
    	                    margin:10,
    	                    lineColor:'#666'
    	                },
    	                labels:{
    	                    style:{
    	                        color:'#333',
    	                        fontSize:'10px'
    	                    }
    	                }}
    	            ],
    	            tooltip: {
    	                headerFormat: '<b>{series.name}</b><br>',
    	               // pointFormat: '{point.x:%e. %b %Y}: {point.y:,.0f}'
    	                pointFormat: '{point.x:'+interval+'} | {point.y:,.0f}'
    	            },
    	            series: [{
    	                name: value,
    	                showInLegend:false,
    	                color: Highcharts.getOptions().colors[key],
    	                data: data[value] //[1, 0, 4]
    	            }]/*,{
    	                 name: "1",
    	                 data: yaxis1 
    	            },{
    	                 name: "2",
    	                 data: yaxis2 
    	            },{
    	                 name: "3",
    	                 data: yaxis3 
    	            }]*/
    	        });
    	    });
    	        return true;
    	       // Highcharts.charts.push( mychart);
    	  //  }
    	 
     }
}

module.exports = new FtChart();