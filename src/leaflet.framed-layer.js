L.FramedLayer =   L.Layer.extend({
	_layers: {},
	_layer: null,
	triangles:[],
	_bounds: null,
	options:{
	
		fill: "#ff0000",
		fillOpacity: 0.6,
		stroke: "#ff0000",
		strokeWidth:1
		},
	initialize( layer, options){
		
		this.options = L.Util.setOptions(this, options);
		this._layer = layer;
		this._bounds = layer.getBounds();
		console.log( "initialize");
		return this;
	},

	_addTriangles(){
		var centerG = this._bounds.getCenter();
		var center = map.latLngToLayerPoint(this._bounds.getCenter());
		console.log( center);
		
		var top = map.latLngToLayerPoint( this._bounds.getNorthWest());
		console.log( top);
		var pointTop = L.point( center.x, top.y - 10);
		var latlng = map.layerPointToLatLng( pointTop);
		var path = [this.bounds.getNorthWest(), latlng, this._bounds.getNorthEast()];
		console.log(path);
		var polygon = L.polygon( path, { fill:"red", opacity:1}).addTo(map);
		this.triangles[0] = polygon;
		
	},
	onAdd( map){
		this._map = map;
		console.log(" add");
		//L.Layer.prototype.addLayer.call( this, this._layer);
		this._map.addLayer( this._layer);
		this._addTriangles(map);
		return this;
		
	},

	setStyle( style){
		
	},
	handleMouseover(){
		
	},
	handleSelected(){
		
	},
	handleUnselected(){
		
	},
	
	resetStyle(){
		
	},
	update(){
		var centerG = this.bounds.getCenter();
		var center = this.map.latLngToLayerPoint(this.bounds.getCenter());
		console.log( center);
		
		var top = this.map.latLngToLayerPoint( this.bounds.getNorthWest());
		console.log( top);
		var pointTop = L.point( center.x, top.y - 10);
		var latlng = this.map.layerPointToLatLng( pointTop);
		var path = [this.bounds.getNorthWest(), latlng, this.bounds.getNorthEast()];
		console.log(path);
		//var polygon = L.polygon( path, this.options).addTo( this.map);
		this.triangles[0].setPath(path);
		
	}
})

module.exports = L.FramedLayer;