/**
 * 
 */

function FtMap(){
	var _lang ="fr";
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
	
	var L = require('leaflet');

	
	L.isValidBbox = function( bbox){

		if( bbox.north && bbox.east && bbox.west && bbox.south){
			
			bbox.north = L.modLat(bbox.north);
			bbox.south = L.modLat(bbox.south);
			bbox.east = L.modLng(bbox.east);
			bbox.west = L.modLng(bbox.west);
			if(bbox.east < bbox.west){
					bbox.east +=360;
				
			}
			
			return bbox;
		}else{
			return false;
		}
	}
	L.isValidBounds =  function( ne, sw ){
		if( Math.abs( ne.lat - sw.lat)>=180 
				|| Math.abs( ne.lng - sw.lng)>=360){
			return false;
		}else{
			return true;
		}
	}
	L.modLat = function( lat ){
		lat = lat%180;
		if( lat > 90 ){
			lat -= 180;
		}else if( lat < -90 ){
			lat += 180;
		}
		return lat;
	}
	L.modLng = function( lng ){
		lng = lng%360;
		if( lng > 180 ){
			lng -= 360;
		}else if( lng < -180 ){
			lng += 360;
		}
		return lng;
	}
	L.bbox2bounds = function( bbox ){
	   bbox = L.isValidBbox (bbox);

		var ne = [ bbox.north, bbox.east];
		var sw = [ bbox.south, bbox.west];
		return [ne, sw];
	}
	
	
	//L.selectArea = require("./leaflet.select-area.js");
	this.map = null;
	this.observatories = null;
	
	this.handleReset = function(){
		  if( this.observatories){
              this.observatories.remove();
              
          }
	  }
	  
	this.initialize = function( container, lang){
	     _lang = lang;
		
		 this.map = L.map( container, {selectArea:true}).setView([51.505, -0.09], 3);
		 console.log( this.map);
		  L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
		      attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
		      maxZoom: 18,
		      minZoom:1
		  }).addTo( this.map );
		
		 // this.map.on( "resize", this.resize);
		  
		//  this.resize(h);
		  
//		  this.selectArea = L.selectArea(
//				  {
//					  map:this.map, 
//					  options:{
//						  width:400, 
//						  height:300, 
//						  color:"#DD9946"
//					  }});
	}
	this.resize = function( h){
		if( !this.map) return;
		  this.height = h - this.map._container.getBoundingClientRect().top -5;
          this.map._container.style.height = Math.round(this.height ) +"px";
// 	      this.$el.querySelector("#formatermap").style.height = Math.round(this.height) + "px";
          this.map.invalidateSize()
	}
	this.displayResults = function( event ){
		  this.handleReset();
		  
          var iconOptions = { icon: 'magnet', prefix: 'fa', markerColor: 'blue'};
          var iconMarkerIntermagnet= new L.AwesomeMarkers.icon( iconOptions);
          var iconOptions = { icon: 'magnet', prefix: 'fa', markerColor: 'orange'};
          var iconMarkerBCMT= new L.AwesomeMarkers.icon( iconOptions);
          var lang = this.lang;
          var query = event.detail.query;
          
          this.observatories = L.geoJSON(event.detail.result, {
              /*style: function (feature) {
                  return feature.properties && feature.properties.style;
              },

              onEachFeature: onEachFeature,*/

              pointToLayer: function (feature, latlng) {
                 // console.log(feature.properties.title[lang]);
                  if( feature.properties.organism == "INTERMAGNET"){
                	  var iconMarker = iconMarkerIntermagnet;
                	  var color = "blue";
                  }else{
                	  var iconMarker = iconMarkerBCMT;
                	  var color = "orange";
                  }
                 
                  var marker = new L.Marker(
                          latlng,
                          {icon: iconMarker,
                           name: feature.properties.identifiers.customId,
                           title: feature.properties.name[lang],
                           properties: feature.properties,
                           color: color,
                           query: query
                          });
                  //marker.createPopup(lang);
                  //search data??
                 // var url = "http://formater.art-sciences.fr";
                  //var url = "http://api.formater"
                 // 
                  marker.on('click', function(e ){
                	  console.log(query);
                	  this.createPopup(lang);
                	 // if(_selected == this){
                		//  var event = new CustomEvent("unselectLayer", { detail:{}});
                    	//  document.dispatchEvent(event);
                	 // }
                	//  _selected = this.toggle( _selected );
                	 // console.log( event);
                      //console.log( this.options.name);
                  })
                  return marker;
              }
          });
          this.observatories.addTo( this.map);
         // this.observatoriesRequest();
          //event observatories for map
         
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
	        console.log( "toggle marker");
			
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
				   if( this.response.error = "FTP_FAILED"){
					   //DISABLE THE URL FOR OTHER WHICH SAME SERVER
					   console.log( obs.api.name);
					   window.disabledUrl.push( obs.api.name);
				   }
			   }else{
				   obs.process.status = "DONE";
				   obs.data = this.response;
				   var links = obs.data.meta.get("FTP_DOWNLOAD_LINK");
				   console.log("REPONSE");
				   console.log( links);
			    	 console.log( obs);
			    	 //DELETE OLD LINK FTP
			    	 if( obs.links){
			    		 var i = obs.links.length-1;
			    		while(i>=0){
			    			if(obs.links[i].prov){
			    				obs.links.splice(i,1);
			    			}
			    			i--;
			    		}
			    		for(var i=0;i<links.length;i++){
			    			 links[i].prov = true;
			    			obs.links.push(links[i]);
			    		}
			    	 }
				   var event = new CustomEvent("findData", {detail: { obs: obs }});
				    document.dispatchEvent(event);
	   
			   }
			    
			  }
			  if (this.readyState == 4 && this.status == 404) {
				  obs.process.status = "ERROR";
				    
			  }
		}
		var req = obs.api.url;//.replace("formater.art-sciences.fr", "api.formater");
		
		
		
		if( query && query.start){
			obs.api.parameters["start"] = query.start;
		}
		if( query && query.end){
			obs.api.parameters["end"] = query.end;
		}
		//console.log( obs.api.parameters.type);
		//if( obs.api.parameters.length>0){
			var i = 0;
			for(var key in obs.api.parameters){
				//console.log( key);
				if(i == 0){
					req += "?";
				}else{
					req += "&";
				}
				i++;
				req += key +"="+obs.api.parameters[key];
			}
		//}
		//console.log( req);
		xhttp.open("GET", encodeURI( req ), true);
		if( window.disabledUrl.indexOf(obs.api.name)<0){
			xhttp.send();
		}
		
	}
	L.Marker.prototype.createPopup = function(  ){
		if( this.popup){
			return;
		}
		console.log( this.options.properties);
		var _this = this;
		var node = document.createElement("div");
		var h4 = document.createElement("h4");
		h4.textContent = this.options.properties.name[_lang];
		node.appendChild( h4);
		var div = document.createElement("div");
		div.innerHTML = this.options.properties.description[_lang];
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
			input.setAttribute( "value", obs.title[_lang]);
			
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
	
	
	
	return this;
}
module.exports = new FtMap();