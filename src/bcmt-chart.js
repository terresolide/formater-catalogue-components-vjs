/**
 * 
 */
var Highcharts = require('highcharts');
function Bcmt(){

	var _mousemoveListener = null;
	var _touchstartListener = null;
    var _touchmoveListener = null;
    
  
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

	 this.intervalType = function( intervalType, dataType){
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
	this.createChart = function( container,data0){
		
		  if(! _mousemoveListener){ 	 
    		  _addListeners(container);
	    	
    	 }
	
		var dataType = data0.meta.get("Data Type");
	    var interval = this.intervalType(data0.meta.get("Data Interval Type"), dataType);
     
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
    	     
    	        var divchart = document.createElement("div");
    	        divchart.classname = "chart";
    	        container.appendChild(divchart);
    	        
    	        var mychart = Highcharts.chart(divchart, {
    	     
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
    	                pointFormat: '{point.x:'+interval+'} | {point.y:,.0f}'
    	            },
    	            series: [{
    	                name: value,
    	                showInLegend:false,
    	                color: Highcharts.getOptions().colors[key],
    	                data: data[value] //[1, 0, 4]
    	            }]
    	        });
    	    });
	        return true;
	 }
	 this.destroy = function(){
		 return true;
	 }
	return this;
}
var bcmt = new Bcmt();
	 module.exports = bcmt;