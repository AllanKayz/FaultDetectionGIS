$(document).ready(function(){

var allLayers = L.layerGroup();

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{maxZoom: 20,subdomains:['mt0','mt1','mt2','mt3']}),
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{maxZoom: 20,subdomains:['mt0','mt1','mt2','mt3']}),
    googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{maxZoom: 20,subdomains:['mt0','mt1','mt2','mt3']}),
    googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{maxZoom: 20,subdomains:['mt0','mt1','mt2','mt3']});  
            
var map = L.map('map', {
    center: [-17.6787561, 31.4719323],
    zoom: 10,
    layers: [googleHybrid,allLayers]
});

var baseLayers = {
    "Google Hybrid": googleHybrid,
    "Google Streets": googleStreets,
    "Google Satellite": googleSat,
    "Google Terrain": googleTerrain
};
 
$('#blayers').click(function() {
    console.log("entered");
    if($('#radio1')[0].checked) {
        googleHybrid.addTo(map);
        googleSat.removeFrom(map);
        googleStreets.removeFrom(map);
        googleTerrain.removeFrom(map);
        
    }
    if($('#radio2')[0].checked) {
        googleSat.addTo(map);
        googleHybrid.removeFrom(map);
        googleStreets.removeFrom(map);
        googleTerrain.removeFrom(map);
    }
    if($('#radio3')[0].checked) {
        googleTerrain.addTo(map);
        googleSat.removeFrom(map);
        googleStreets.removeFrom(map);
        googleHybrid.removeFrom(map);
    }
    if($('#radio4')[0].checked) {
        googleStreets.addTo(map);
        googleSat.removeFrom(map);
        googleHybrid.removeFrom(map);
        googleTerrain.removeFrom(map);
    }

});

});
