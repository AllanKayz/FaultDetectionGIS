$(document).ready(function(){
    // Add AJAX request for data
    var faults = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/experiments/expapi.php",
        dataType: "json",
        success: console.log("Faults data successfully loaded."),
        error: function(xhr) {
            alert(xhr.statusText)
        }
    });

    var poles = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/experiments/expapi.php",
        dataType: "json",
        success: console.log("Poles data successfully loaded."),
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

    var meter = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/meters.php",
        dataType: "json",
        success: console.log("Meter data successfully loaded."),
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

    var roads = $.ajax({
        url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/roads.php",
        dataType: "json",
        success: console.log("Roads data successfully loaded."),
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


    var geojsonMarkerOptions = {
        radius: 4.5,
        fillColor: "#ff7800",
        color: "blue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var transformerMarker = {
        radius: 3.5,
        fillColor : "#fff",
        color: "blue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var switchgearMarker = {
        radius: 4,
        fillColor : "#ccc",
        color: "blue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var substationMarker = {
        radius: 10,
        fillColor : "#eef",
        color: "blue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var meterMarker = {
        radius: 4,
        fillColor : "#eee",
        color: "blue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var meterMarker = {
        radius: 4,
        fillColor : "#cff",
        color: "blue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };


    $.when(faults, transformers, switchgear, meter, substations/* overheard_line, roads*/).done(function() {
        // Add requested external GeoJSON to map
        fault = L.geoJSON(faults.responseJSON,{
            pointToLayer:function(feature,latlng){
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        });

        transformer = L.geoJSON(transformers.responseJSON,{
            pointToLayer:function(feature,latlng){
                return L.circleMarker(latlng, transformerMarker);
            }
        });

        pole = L.geoJSON(poles.responseJSON,{
            pointToLayer:function(feature,latlng){
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        });

        substation = L.geoJSON(substations.responseJSON,{
            pointToLayer:function(feature,latlng){
                return L.circleMarker(latlng, substationMarker);
            }
        });

        switchgears = L.geoJSON(switchgear.responseJSON,{
            pointToLayer:function(feature,latlng){
                return L.circleMarker(latlng, switchgearMarker);
            }
        });

        meters = L.geoJSON(meter.responseJSON,{
            pointToLayer:function(feature,latlng){
                return L.circleMarker(latlng, meterMarker);
            }
        });

        overheard_lines = L.geoJSON(overheard_line.responseJSON,{
            pointToLayer:function(feature,latlng){
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);

        road = L.geoJSON(roads.responseJSON,{
            pointToLayer:function(feature,latlng){
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);

        $( "#lyrtest" ).click(function( event ) {
            layerClicked = window[event.target.value];
        
                if (map.hasLayer(layerClicked)) {
                    map.removeLayer(layerClicked);
                }
                else{
                    map.addLayer(layerClicked);
                } ;
        });
        
    });
  
});
