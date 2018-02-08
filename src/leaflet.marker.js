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
L.Marker.prototype.close = function( ){
	var iconOptions = this.options.icon.options;
	
	iconOptions.markerColor = this.options.color;
	var icon= new L.AwesomeMarkers.icon( iconOptions);
	this.setIcon( icon );
	_selected_marker = null;
}
L.Marker.prototype.toggle = function( ){
	
	if( _selected_marker != null){
		_selected_marker.close();
		
		}

		
		var iconOptions = this.options.icon.options;
		iconOptions.markerColor = "red";
		var icon= new L.AwesomeMarkers.icon( iconOptions);
		this.setIcon( icon );
		_selected_marker = this;
		return this;

}
var _selected = null;
var _selected_marker = null;
function toggle(node){
	if(_selected){
		_selected.className = "";
	}

	if( _selected == node){
		_selected = null;
	}else{
		node.className = "selected";

		_selected = node;
	}
	return _selected;
}

function searchData( obs, query){
	if(!obs.process){
		obs.process = {}
	}
	if( !obs.api || !obs.api.url){
		obs.process.status = "DONE";
	}
	if( obs.process.status == "DONE" || obs.process.status == "ERROR" || obs.process.status == "WAITING"){
		return;
	} 
	obs.process.status = "WAITING";
	var xhttp = new XMLHttpRequest(); 
	xhttp.responseType = "json";
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log( JSON.parse(this.responseText));
			//console.log(_marker.options);
		   // document.getElementById("demo").innerHTML = this.responseText;
		   if(this.response.error){
			   obs.process.status = "ERROR";
		   }else{
			   obs.process.status = "DONE";
			   obs.data = this.response;
			   var event = new CustomEvent("findData", {detail: { obs: obs }});
			    document.dispatchEvent(event);
   
		   }
		    
		  }
		  if (this.readyState == 4 && this.status == 404) {
			  obs.process.status = "ERROR";
			    
		  }
	}
	var req = obs.api.url;
	
	
	
	if( query && query.start){
		obs.api.parameters["start"] = query.start;
	}
	if( query && query.end){
		obs.api.parameters["end"] = query.end;
	}
	console.log( obs.api.parameters.type);
	//if( obs.api.parameters.length>0){
		var i = 0;
		for(var key in obs.api.parameters){
			console.log( key);
			if(i == 0){
				req += "?";
			}else{
				req += "&";
			}
			i++;
			req += key +"="+obs.api.parameters[key];
		}
	//}
	console.log( req);
	xhttp.open("GET", encodeURI( req ), true);
	
	xhttp.send();
	
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
	var div = document.createElement("div");
	div.innerHTML = this.options.properties.description[lang];
	node.appendChild( div);
	if( this.options.properties.organisation){
		var ul = document.createElement("ul");
		this.options.properties.organisation.forEach( function( org, index){
			var li = document.createElement("li");
			li.textContent = org;
			ul.appendChild(li);
		});
		node.appendChild(ul);
	}
	this.options.properties.observations.forEach( function( obs, index){
		var input = document.createElement("input");
		input.setAttribute("type", "button");
		input.setAttribute( "value", obs.title[lang]);
		
		node.appendChild( input);
		function displayInfo(e){
			if(_selected_marker)
			_selected_marker.close();
			var event = new CustomEvent("unselectInput", { detail:{}});
      	  	 document.dispatchEvent(event);
			 if(this.className != "selected"){
				 
				_selected_marker = _this.toggle( );
				 var event = new CustomEvent("displayInfo", { detail:{marker:_this, observation: obs, index: index}});
	       	    document.dispatchEvent(event);
			 }
			 _selected = toggle( this);
			 searchData( obs , _this.options.query);
		}
		
		input.addEventListener("click", displayInfo);
		/*input.addEventListener("closeSheet", function(){
			console.log( "close");
			if( _selected_marker){
				_selected_marker.close();
			}
			this.className = "";
		})*/
	});
	this.popup = node;
	this.bindPopup( node );
	
	this.openPopup();
}

document.addEventListener("closeSheet", function(e){
	if( _selected){
		var event = new MouseEvent("click", {});
		_selected.dispatchEvent(event);
	}
	
})
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