type = ['', 'info', 'success', 'warning', 'danger'];

artisan = {

    initCrew: function () {
        $.ajax({
            type: 'GET',
            url: '../server/crew.php?action=crewmembers',
            success: function (response) {

                response = JSON.parse(response);
                console.log("Crew Data Loaded");
                var tr;
                $('#crewMembers').html('');
                $.each(response, function (CrewFore, crew) {
                    tr = $('<tr/>');
                    tr.append("<td scope='row'>" + crew.firstname + "</td>");
                    tr.append("<td>" + crew.surname + "</td>");
                    tr.append("<td>" + crew.rank + "</td>");
                    tr.append("<td>" + crew.skillset + "</td>");

                    $('#crewMembers').append(tr);
                });
            }
        });
    },

    initEquipment: function () {
        $.ajax({
            type: 'GET',
            url: '../server/equipment.php?action=equipment',
            success: function (response) {

                response = JSON.parse(response);
                console.log("Equipment Data Loaded");
                var tr;
                $('#Equipment').html('');
                $.each(response, function (EquipFore, equipment) {
                    tr = $('<tr/>');
                    tr.append("<td scope='row'>" + equipment.type + "</td>");
                    tr.append("<td>" + equipment.name + "</td>");
                    tr.append("<td>" + equipment.condition + "</td>");

                    $('#Equipment').append(tr);
                });
            }
        });
    },

    initAddLayers: function () {

        var poles = $.ajax({
            url: "http://localhost:4500/faultDetectionGIS/Fault_GIS_AI_App/api/poles.php",
            dataType: "json",
            success: console.log("County data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText);
            }
        });

        var faults = $.ajax({
            url: "http://localhost:4500/faultDetectionGIS/Fault_GIS_AI_App/api/faults.php",
            dataType: "json",
            success: console.log("Faults data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText);
            }
        });

        var transformers = $.ajax({
            url: "http://localhost:4500/faultDetectionGIS/Fault_GIS_AI_App/api/transformer.php",
            dataType: "json",
            success: console.log("Transformer data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText);
            }
        });

        var overheard_line = $.ajax({
            url: "http://localhost:4500/faultDetectionGIS/Fault_GIS_AI_App/api/overhead_line.php",
            dataType: "json",
            success: console.log("Overhead_Lines data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText);
            }
        });

        var meter = $.ajax({
            url: "http://localhost:4500/faultDetectionGIS/Fault_GIS_AI_App/api/meters.php",
            dataType: "json",
            success: console.log("Meter data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText);
            }
        });

        var substations = $.ajax({
            url: "http://localhost:4500/faultDetectionGIS/Fault_GIS_AI_App/api/substations.php",
            dataType: "json",
            success: console.log("Substations data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText);
            }
        });

        var switchgear = $.ajax({
            url: "http://localhost:4500/faultDetectionGIS/Fault_GIS_AI_App/api/switchgear.php",
            dataType: "json",
            success: console.log("Switchgear data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText);
            }
        });



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


            // Add Poles GeoJSON to map
            var pole = L.geoJSON(poles.responseJSON, {
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
                }
            });

            // Add Lines GeoJSON to map
            function overhead_lineStyle(feature) {
                return {
                    "color": feature.properties.stylecolor,
                    "weight": 5
                };
            }

            var overheadlines = L.geoJSON(overheard_line.responseJSON, {
                style: overhead_lineStyle
            }).addTo(map);


            // Add Transformer GeoJSON to map
            var transformerIcon = L.icon({
                iconUrl: '../img/transformer.png',
                iconSize: [16, 16]
            });

            var transformer = L.geoJSON(transformers.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: transformerIcon });
                }
            });


            // Add Substation GeoJSON to map
            var subIcon = L.icon({
                iconUrl: '../img/substation.png',
                iconSize: [30, 30]
            });

            var substation = L.geoJSON(substations.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: subIcon });
                }
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

            var meters = L.geoJSON(meter.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, meterMarker);
                }
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

            var switchgears = L.geoJSON(switchgear.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, switchMarker);
                }
            });

            // Add Faults GeoJSON to map
            var faultIcon = L.icon({
                iconUrl: '../img/fault.png',
                iconSize: [25, 25]
            });

            var fault = L.geoJSON(faults.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: faultIcon });
                }
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
    },

    showNotification: function (from, align) {
        color = Math.floor((Math.random() * 4) + 1);

        $.notify({
            icon: "pe-7s-gift",
            message: "Welcome <b>Artisan Kuvarega</b> - have a great day Sir."

        }, {
            type: type[color],
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    }

}