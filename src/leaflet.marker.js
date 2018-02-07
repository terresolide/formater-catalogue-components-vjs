/**
 * 
 */
L.Marker.prototype.searchData = function( url){
	if( this.options.properties.status == "DONE" || this.options.properties.status == "ERROR" || this.options.properties.status == "WAITING"){
		return;
	} 
	this.options.properties.status = "WAITING";
	var xhttp = new XMLHttpRequest(); 
	xhttp.responseType = "json";
	var _marker = this;
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log( JSON.parse(this.responseText));
			//console.log(_marker.options);
		   // document.getElementById("demo").innerHTML = this.responseText;
		   if(this.response.error){
			   _marker.options.properties.status = "ERROR";
		   }else{
			   _marker.options.properties.status = "DONE";
			   _marker.options.properties.data = this.response;
			   var event = new CustomEvent("findData", {detail: { marker: _marker }});
			    document.dispatchEvent(event);
   
		   }
		    
		  }
		  if (this.readyState == 4 && this.status == 404) {
			  _marker.options.data.status = "ERROR";
			    
		  }
	}
	var req = url+"/cds/bcmt/data/"+this.options.name.toLowerCase();
	
	if(this.options.query.start || this.options.query.end){
		req += "?";
	}
	if( this.options.query.start){
		req += "start=" + this.options.query.start;
		if( this.options.query.end){
			req += "&end=" + this.options.query.end;
		}
	}else{
		if( this.options.query.end){
			req += "end=" + this.options.query.end;
		}
	}
	xhttp.open("GET", encodeURI( req ), true);
	
	xhttp.send();
	
}

//globally available
function handle_global(e){
  
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

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
        	//console.log(chart);
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                }
            }
        });
    }
}

L.Marker.prototype.toggle = function( layer){
	
	var iconOptions = this.options.icon.options;
	//console.log(iconOptions);

	if( layer == this){
		
		iconOptions.markerColor = this.options.color;
		var icon= new L.AwesomeMarkers.icon( iconOptions);
		this.setIcon( icon );
		return null;
	}else{
		iconOptions.markerColor = "red";
		var icon= new L.AwesomeMarkers.icon( iconOptions);
		this.setIcon( icon );
		return this;
	}
}
L.Marker.prototype.createPopup = function( lang ){
	if( this.popup){
		return;
	}
	var _this = this;
	var node = document.createElement("div");
	var h4 = document.createElement("h4");
	h4.textContent = this.options.properties.name[lang];
	node.appendChild( h4);
	this.options.properties.observations.forEach( function( obs, index){
		var input = document.createElement("input");
		input.setAttribute("type", "button");
		input.setAttribute( "value", obs.title[lang]);
		
		node.appendChild( input);
		function displayInfo(e){
			 if(this.className == "selected"){
				 //close the window
				 this.className = "";
				 
				 var event = new CustomEvent("unselectInput", { detail:{}});
           	  	 document.dispatchEvent(event);
			 }else{
				 //display INfo
				 this.className = "selected";
				 _this.toggle( _this);
				 var event = new CustomEvent("displayInfo", { detail:{marker:_this, observation: obs, index: index}});
	       	    document.dispatchEvent(event);
			 }
			//_this.searchData( "http://formater.art-sciences.fr");
		}
		
		input.addEventListener("click", displayInfo);
		input.addEventListener("closeSheet", function(){
			this.className = "";
		})
	});
	this.popup = node;
	this.bindPopup( node );
	
	this.openPopup();
}
Array.prototype.get= function( name ){
	var i=0;
	find = false;
	while( !find && i< this.length){
		if( this[i].name == name){
			find = this[i].content;
		}
		i++;
	}
	return find;
}