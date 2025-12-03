simulator = {

    initSimulator: function () {
        var poles = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/poles.php",
            dataType: "json",
            success: console.log("County data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })

        var faults = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/faults.php",
            dataType: "json",
            success: console.log("Faults data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })

        var transformers = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/transformer.php",
            dataType: "json",
            success: console.log("Transformer data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })

        var overheard_line = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/overhead_line.php",
            dataType: "json",
            success: console.log("Overhead_Lines data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })

        var meter = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/meters.php",
            dataType: "json",
            success: console.log("Meter data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })

        var substations = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/substations.php",
            dataType: "json",
            success: console.log("Substations data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })

        var switchgear = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/switchgear.php",
            dataType: "json",
            success: console.log("Switchgear data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })

        $.when(poles).done(function () {

            var allLayers = L.layerGroup();

            var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
                googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
                googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
                googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] });

            var map = L.map('map', {
                center: [-17.6787561, 31.4719323],
                zoom: 10,
                layers: [googleHybrid, allLayers]
            });

            var baseLayers = {
                "Google Hybrid": googleHybrid,
                "Google Streets": googleStreets,
                "Google Satellite": googleSat,
                "Google Terrain": googleTerrain
            };

            var fault, substation, meters, switchgears, overheadlines, transformer, pole;

            function highlightFeature(e) {
                var layer = e.target;
                layer.setStyle({
                    weight: 5,
                    color: 'violet',
                    dashArray: '',
                    fillOpacity: 0.7
                });

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }

                //info.update(layer.feature.properties);
            }

            function zoomFeature(e, layer) {
                map.fitBounds(e.target.getBounds());

                var coord = e.latlng.toString();
                var popup = '<a class="btn btn-danger action-btn" action-btn-value="add" data-toggle="modal" data-target="#add_model">'+
                            'Simulate Fault Here..</a>';
                overheadlines.bindPopup(popup);
                $("#geom").val(e.latlng.lng+""+e.latlng.lat);
                $("#btn_add").click(function () {
                    ajaxAction('add');
                });
        
                function ajaxAction(action) {
                    data = $("#frm_" + action).serializeArray();
                    console.log(data);
                    $.ajax({
                        type: "POST",
                        url: "http://localhost/FaultDetectionGIS/Fault_GIS_AI_Simulator/server/simulator.php",
                        data: data,
                        dataType: "json",
                        success: function (response) {
							console.log(response);
                            $('#msg').html('');
                            if (response.status) {
                                $('#' + action + '_model').modal('hide');
                                $('#msg').html('<div class="alert alert-success">Successfully! added record</div>');
                                
                            } else {
                                $('#msg').html('<div class="alert alert-danger ">Error! to insert record</div>');
                            }
        
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log('error happened' + errorThrown + textStatus);
							console.log(data);
                            $('#msg').html('<div class="alert alert-danger ">Error' + textStatus + '!' + errorThrown);
                        }
                    });
                }
            }

            


            /*map.on("contextmenu", function (event) {
                console.log("user right-clicked on map coordinates: " + event.latlng.toString());
                var point = L.marker(event.latlng);
                point.addTo(map);
                var coord = event.latlng;
            });*/

            function resetHighlight(e) {
                overheadlines.resetStyle(e.target);
            }

            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomFeature
                });
            }

            // Add Poles GeoJSON to map
            pole = L.geoJSON(poles.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    var poleMarker = {
                        fillColor: feature.properties.stylecolor,
                        color: "#FFF",
                        fillOpacity: 1,
                        opacity: 0.8,
                        weight: 1,
                        radius: 8
                    };

                    return L.circleMarker(latlng, poleMarker);
                },
                onEachFeature: onEachFeature
            });

            // Add Lines GeoJSON to map
            function overhead_lineStyle(feature) {
                return {
                    "color": feature.properties.stylecolor,
                    "weight": 5
                };
            }

            overheadlines = L.geoJSON(overheard_line.responseJSON, {
                style: overhead_lineStyle,
                onEachFeature: onEachFeature
            }).addTo(map);


            // Add Transformer GeoJSON to map
            var transformerIcon = L.icon({
                iconUrl: '../img/transformer.png',
                iconSize: [16, 16]
            });

            transformer = L.geoJSON(transformers.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: transformerIcon });
                },
                onEachFeature: onEachFeature
            });


            // Add Substation GeoJSON to map
            var subIcon = L.icon({
                iconUrl: '../img/substation.png',
                iconSize: [30, 30]
            });

            substation = L.geoJSON(substations.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: subIcon });
                },
                onEachFeature: onEachFeature
            }).addTo(map);

            // Add Meters GeoJSON to map
            var meterMarker = {
                radius: 4,
                fillColor: "red",
                color: "green",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            meters = L.geoJSON(meter.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, meterMarker);
                },
                onEachFeature: onEachFeature
            });

            // Add SwitchGear GeoJSON to map
            var switchMarker = {
                radius: 6,
                fillColor: "purple",
                color: "blue",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            switchgears = L.geoJSON(switchgear.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, switchMarker);
                },
                onEachFeature: onEachFeature
            });

            // Add Faults GeoJSON to map
            var faultIcon = L.icon({
                iconUrl: '../img/fault.png',
                iconSize: [25, 25]
            });

            fault = L.geoJSON(faults.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: faultIcon });
                },
                onEachFeature: onEachFeature
            }).addTo(map);


            var layers = L.layerGroup([fault, substation, meters, switchgears, overheadlines, transformer, pole]);

            var overlays = {
                "Faults": fault,
                "Substations": substation,
                "Overheard Lines": overheadlines,
                "Poles": pole,
                "SwitchGear": switchgears,
                "Transformers": transformer,
                "Meters": meters
            };

            L.control.layers(baseLayers, overlays).addTo(map);

        });
    }
}
