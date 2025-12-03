$(document).ready(function(){
    var poles = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/poles.php",
        dataType: "json",
        success: console.log("County data successfully loaded."),
        error: function(xhr) {
            alert(xhr.statusText)
        }
    })

    var faults = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/experiments/expapi.php",
        dataType: "json",
        success: console.log("Faults data successfully loaded."),
        error: function(xhr) {
            alert(xhr.statusText)
        }
    })

    var transformers = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/transformer.php",
        dataType: "json",
        success: console.log("Transformer data successfully loaded."),
        error: function(xhr) {
            alert(xhr.statusText)
        }
    })

    var overheard_line = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/overhead_line.php",
        dataType: "json",
        success: console.log("Overhead_Lines data successfully loaded."),
        error: function(xhr) {
            alert(xhr.statusText)
        }
    })

    var meter = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/meters.php",
        dataType: "json",
        success: console.log("Meter data successfully loaded."),
        error: function(xhr) {
            alert(xhr.statusText)
        }
    })

    var substations = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/substations.php",
        dataType: "json",
        success: console.log("Substations data successfully loaded."),
        error: function(xhr) {
            alert(xhr.statusText)
        }
    })

    var switchgear = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/switchgear.php",
        dataType: "json",
        success: console.log("Switchgear data successfully loaded."),
        error: function(xhr) {
            alert(xhr.statusText)
        }
    })



    $.when(poles).done(function() {
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
        
        // Add Poles GeoJSON to map
        var poleMarker = {
            radius: 4,
            fillColor : "#fff",
            color: "blue",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var pole = L.geoJSON(poles.responseJSON,{
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);

        // Add Lines GeoJSON to map
        var myStyle = {
            "color": "red",
            "weight": 5,
            "opacity": 0.65
        };

        var overheadlines = L.geoJSON(overheard_line.responseJSON,{
            style: myStyle
        }).addTo(map);


        // Add Transformer GeoJSON to map
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var transformer = L.geoJSON(transformers.responseJSON, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);

        // Add Substation GeoJSON to map
        var substationMarker = {
            radius: 18,
            fillColor : "yellow",
            color: "brown",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var substation = L.geoJSON(substations.responseJSON,{
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, substationMarker);
            }
        }).addTo(map);

        // Add Meters GeoJSON to map
        var meterMarker = {
            radius: 4,
            fillColor : "red",
            color: "green",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var meters = L.geoJSON(meter.responseJSON,{
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, meterMarker);
            }
        }).addTo(map);

        // Add SwitchGear GeoJSON to map
        var switchMarker = {
            radius: 6,
            fillColor : "purple",
            color: "blue",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var switchgears = L.geoJSON(switchgear.responseJSON,{
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, switchMarker);
            }
        }).addTo(map);

        // Add Faults GeoJSON to map
        var faultMarker = {
            radius: 6,
            fillColor : "red",
            color: "blue",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var fault = L.geoJSON(faults.responseJSON,{
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, faultMarker);
            }
        }).addTo(map);
        

    });
});