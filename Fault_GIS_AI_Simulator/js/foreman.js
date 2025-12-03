type = ['', 'info', 'success', 'warning', 'danger'];

foreman = {

    initAddMap: function () {

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------*/
        //First Map Ajax Callbacks

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




        /*-------------------------------------------------------------------------------------------------------------------------------------------------------*/
        //Second Map Ajax Callbacks

        var artisanloc = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/poles.php",
            dataType: "json",
            success: console.log("artisan location data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })

        $.when(poles).done(function () {
			
			//console.log(poles);

            var allLayers = L.layerGroup();

            var pole, overheadlines, switchgears, fault, substation, transformer, meters;

            var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
                googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
                googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
                googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] });

            var map = L.map('map', {
                center: [-17.6787561, 31.4719323],
                zoom: 10,
                layers: [googleHybrid, allLayers],
                fullscreenControl: true,
                fullscreenControlOptions: { // optional
                    title: "Show me the fullscreen !",
                    titleCancel: "Exit fullscreen mode"
                }
            });

            // detect fullscreen toggling
            map.on('enterFullscreen', function () {
                if (window.console) window.console.log('enterFullscreen');
            });
            map.on('exitFullscreen', function () {
                if (window.console) window.console.log('exitFullscreen');
            });

            var baseLayers = {
                "Google Hybrid": googleHybrid,
                "Google Streets": googleStreets,
                "Google Satellite": googleSat,
                "Google Terrain": googleTerrain
            };

            //Get layer properties
            function getAttr(k) {
                //var layer = [fault, substation, meters, switchgears, overheadlines, transformer, pole];
                var linePopup = "<table class='table table-striped table-bordered'>" +
                    "<thead class='thead-info'>" +
                    "<tr class='table-danger'>" +
                    "<th scope='col'>Attribute</th>" +
                    "<th scope='col'>Value</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<tr><td>ID</td><td>" + k.target.feature.properties.id + "</td></tr>" +
                    "<tr><td>Feeder</td><td>" + k.target.feature.properties.feeder_nam + "</td></tr>" +
                    "<tr><td>Conductor Type</td><td>" + k.target.feature.properties.cond_type + "</td></tr>" +
                    "<tr><td>Conductor Size</td><td>" + k.target.feature.properties.cond_size + "mm" + "</td></tr>" +
                    "<tr><td>Voltage</td><td>" + k.target.feature.properties.voltage + "kV" + "</td></tr>" +
                    "</tbody>";
                overheadlines.bindPopup(linePopup);

                var polePopup = "<table class='table table-striped table-bordered'>" +
                    "<thead class='thead-info'>" +
                    "<tr class='table-danger'>" +
                    "<th scope='col'>Attribute</th>" +
                    "<th scope='col'>Value</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<tr><td>ID</td><td>" + k.target.feature.properties.id + "</td></tr>" +
                    "<tr><td>Structure</td><td>" + k.target.feature.properties.structure_ + "</td></tr>" +
                    "<tr><td>Material</td><td>" + k.target.feature.properties.material + "</td></tr>" +
                    "<tr><td>Insulator</td><td>" + k.target.feature.properties.insulator + "</td></tr>" +
                    "<tr><td>Construction Type</td><td>" + k.target.feature.properties.constructi + "</td></tr>" +
                    "<tr><td>Cross arm</td><td>" + k.target.feature.properties.crossarm + "</td></tr>" +
                    "<tr><td>Staywire</td><td>" + k.target.feature.properties.staywire + "</td></tr>" +
                    "<tr><td>Staywire guage</td><td>" + k.target.feature.properties.staywire_g + "</td></tr>" +
                    "</tbody>";
                pole.bindPopup(polePopup);

                var substationPopup = "<table class='table table-striped table-bordered'>" +
                    "<thead class='thead-info'>" +
                    "<tr class='table-danger'>" +
                    "<th scope='col'>Attribute</th>" +
                    "<th scope='col'>Value</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<tr><td>ID</td><td>" + k.target.feature.properties.gid + "</td></tr>" +
                    "<tr><td>Name</td><td>" + k.target.feature.properties.name + "</td></tr>" +
                    "<tr><td>Customers Served</td><td>" + "null" + "</td></tr>" +
                    "<tr><td>Estimated Energy Consumption</td><td>" + "null" + "</td></tr>" +
                    "</tbody>";
                substation.bindPopup(substationPopup);

                var transformerPopup = "<table class='table table-striped table-bordered'>" +
                    "<thead class='thead-info'>" +
                    "<tr class='table-danger'>" +
                    "<th scope='col'>Attribute</th>" +
                    "<th scope='col'>Value</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<tr><td>ID</td><td>" + k.target.feature.properties.gid + "</td></tr>" +
                    "<tr><td>Name</td><td>" + k.target.feature.properties.substation + "</td></tr>" +
                    "<tr><td>Size</td><td>" + k.target.feature.properties.trfr_size + "</td></tr>" +
                    "<tr><td>Voltage Rating</td><td>" + k.target.feature.properties.voltage_ra + "</td></tr>" +
                    "<tr><td>Use/Application</td><td>" + k.target.feature.properties.applicatio + "</td></tr>" +
                    "<tr><td>Customers Served</td><td>" + "null" + "</td></tr>" +
                    "<tr><td>Estimated Energy Consumption</td><td>" + "null" + "</td></tr>" +
                    "</tbody>";
                transformer.bindPopup(transformerPopup);

                var faultPopup = "<table class='table table-striped table-bordered'>" +
                    "<thead class='thead-info'>" +
                    "<tr class='table-danger'>" +
                    "<th scope='col'>Attribute</th>" +
                    "<th scope='col'>Value</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<tr><td>ID</td><td>" + k.target.feature.properties.fid + "</td></tr>" +
                    "<tr><td>Type</td><td>" + k.target.feature.properties.type + "</td></tr>" +
                    "<tr><td>Name</td><td>" + k.target.feature.properties.fname + "</td></tr>" +
                    "<tr><td>Severity</td><td>" + k.target.feature.properties.severity + "</td></tr>" +
                    "<tr><td>Priority</td><td>" + k.target.feature.properties.priority_level + "</td></tr>" +
                    "<tr><td>Status</td><td>" + "null" + "</td></tr>" +
                    "<tr><td>Given To</td><td>" + "null" + "</td></tr>" +
                    "</tbody>";
                fault.bindPopup(faultPopup);

            }

            function highlightFeature(e) {
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: 'black',
                    dashArray: '',
                    fillOpacity: 0.7
                });

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }

                //info.update(layer.feature.properties);
            }

            function resetHighlight(e) {
                overheadlines.resetStyle(e.target);
            }

            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: getAttr
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
                    //"color": 'rgba(2, 166, 253, 0.05)',
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
                //onEachFeature: onEachFeature
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


            var Legend = new L.Control.Legend({
                position: 'bottomleft',
                collapsed: true,
                controlButton: {
                    title: "Legend"
                }
            });
            map.addControl(Legend);

            $(".legend-container").append($("#legend"));
            $(".legend-toggle").append("<i class='legend-toggle-icon fas fa-list fa-2x' style='color: #000'></i>");

            //<i class="fas fa-list-alt"></i>


            /*-------------------------------------------------------------------------------------------------------------------------------------------------------*/
            //Second Map Code

            
            var artisans, lines, clientsNoPower, noPowerBuffer;

            var map2llLayers = L.layerGroup();

            var googleHy = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
                googleStr = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] });

            var map2 = L.map('map2', {
                center: [-17.6787561, 31.4719323],
                zoom: 10,
                layers: [googleHy, map2llLayers],

            });

            var map2baseLayers = {
                "Google Hybrid": googleHy,
                "Google Streets": googleStr
            };

            $('#pills-profile').on('load', function (e) {
                map2.invalidateSize();
                console.log("when done executed");
            });

            map2.invalidateSize();
            // Add Artisan Locations GeoJSON to map
            var artisanIcon = L.icon({
                iconUrl: '../img/artisan.png',
                iconSize: [25, 25]
            });

            artisans = L.geoJSON(artisanloc.responseJSON, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: artisanIcon });
                },
                //onEachFeature: onEachFeature
            });

            var map2overlays = {
                "Artisans": artisans
            }

            L.control.layers(map2baseLayers).addTo(map2);

        });
    },

    initRegister: function () {
        $.ajax({
            type: 'GET',
            url: '../server/employeeRegister.php?action=register',
            success: function (response) {

                response = JSON.parse(response);
                console.log(response);
                var tr;
                $('#register').html('');
                $.each(response, function (regFore, register) {
                    tr = $('<tr/>');
                    tr.append("<td scope='row'>" + register.firstname + "</td>");
                    tr.append("<td>" + register.surname + "</td>");
                    tr.append("<td>" + register.rank + "</td>");
                    tr.append("<td>" + register.status + "</td>");
                    tr.append("<td>" + register.start_time + "</td>");

                    $('#register').append(tr);
                });
            }
        });
    },

    showNotification: function (from, align) {
        color = Math.floor((Math.random() * 4) + 1);

        $.notify({
            icon: "pe-7s-gift",
            message: "Welcome <b>Foreman Mukondiwa</b> - have a great day Sir."

        }, {
                type: type[color],
                timer: 4000,
                placement: {
                    from: from,
                    align: align
                }
            });
    },

    initStatistics: function () {
        var damagedAssets = document.getElementById('damagedAssets').getContext('2d'),
            industrial = $('#industrial').html(),
            commercial = $('#commercial').html(),
            residential = $('#residential').html(),
            money = $('#money').html(),
            activeoutage = $('#activeoutage').html(),
            cacheData;

            //Current faults ajax
            $.ajax({
                url: 'http://localhost/FaultDetectionGIS/Fault_GIS_AI_App/server/stats.php?action=currentfaults',
                type: 'GET',
                success: function(data){
                    data = JSON.parse(data);
                    console.log(data)
                    $('#currentfaults').html();

                    $.each(data, function(cfault, currentf){

                        if(currentf.rectification == 'Pending'){
                            var content = '<a href="#" class="list-group-item list-group-item-action">'+
                                '<div class="media" style="font-size: 13px;">'+
                                    '<img class="align-self-center" src="../img/pending.gif" width="60px" height="40px">'+
                                    '<div class="media-body">'+
                                        '<ul>'+
                                            '<li><small>Fault ID: '+currentf.fid+'</small></li>'+
                                            '<li><small>Caused By: '+currentf.type+'</small></li>'+
                                            '<li><small>Allocated To: '+currentf.artisan+'</small></li>'+
                                            '<li><small>Repair Status: '+currentf.rectification+'</small></li>'+
                                        '</ul>'+
                                    '</div>'+
                                '</div>'+
                            '</a>';
                            var auto_refresh = setInterval($('#currentfaults').append(content),300); 
                        }
                        else if (currentf.rectification == 'In progress'){
                            var content = '<a href="#" class="list-group-item list-group-item-action">'+
                                '<div class="media" style="font-size: 13px;">'+
                                    '<img class="align-self-center" src="../img/inprogress.gif" width="60px" height="40px">'+
                                    '<div class="media-body">'+
                                        '<ul>'+
                                            '<li><small>Fault ID: '+currentf.fid+'</small></li>'+
                                            '<li><small>Caused By: '+currentf.type+'</small></li>'+
                                            '<li><small>Allocated To: '+currentf.artisan+'</small></li>'+
                                            '<li><small>Repair Status: '+currentf.rectification+'</small></li>'+
                                        '</ul>'+
                                    '</div>'+
                                '</div>'+
                            '</a>';

                            var auto_refresh = setInterval($('#currentfaults').append(content),300);
                        }
                    });
                }
            });

            //Damage reports ajax
            $.ajax({
                url: 'http://localhost/FaultDetectionGIS/Fault_GIS_AI_App/server/stats.php?action=damagereports',
                type: 'GET',
                success: function(data){
                    data = JSON.parse(data);
                    console.log(data)
                    $('#damagereports').html();

                    $.each(data, function(dreports, damageR){

                        if(damageR.severity == 'Critical'){
                            var content = '<a href="#" class="list-group-item list-group-item-action">'+
                                '<div class="media" style="font-size: 13px;">'+
                                    '<img class="align-self-center" src="../img/critical.png" width="40px" height="40px">'+
                                    '<div class="media-body">'+
                                        '<ul>'+
                                            '<li><small>Fault ID: '+damageR.fid+'</small></li>'+
                                            '<li><small>Severity: '+damageR.severity+'</small></li>'+
                                            '<li><small>Recorded on: '+damageR.day_occurrence+'</small></li>'+
                                        '</ul>'+
                                    '</div>'+
                                '</div>'+
                            '</a>';
                            var auto_refresh = setInterval($('#damagereports').append(content),5000); 
                        }
                        else if (damageR.severity == 'Low'){
                            var content = '<a href="#" class="list-group-item list-group-item-action">'+
                                '<div class="media" style="font-size: 13px;">'+
                                    '<img class="align-self-center" src="../img/low.png" width="40px" height="40px">'+
                                    '<div class="media-body">'+
                                        '<ul>'+
                                            '<li><small>Fault ID: '+damageR.fid+'</small></li>'+
                                            '<li><small>Severity: '+damageR.severity+'</small></li>'+
                                            '<li><small>Recorded on: '+damageR.day_occurrence+'</small></li>'+
                                        '</ul>'+
                                    '</div>'+
                                '</div>'+
                            '</a>';
                            var auto_refresh = setInterval($('#damagereports').append(content),5000); 
                        }
                        else if (damageR.severity == 'Medium'){
                            var content = '<a href="#" class="list-group-item list-group-item-action">'+
                                '<div class="media" style="font-size: 13px;">'+
                                    '<img class="align-self-center" src="../img/medium.png" width="40px" height="40px">'+
                                    '<div class="media-body">'+
                                        '<ul>'+
                                            '<li><small>Fault ID: '+damageR.fid+'</small></li>'+
                                            '<li><small>Severity: '+damageR.severity+'</small></li>'+
                                            '<li><small>Recorded on: '+damageR.day_occurrence+'</small></li>'+
                                        '</ul>'+
                                    '</div>'+
                                '</div>'+
                            '</a>';
                            var auto_refresh = setInterval($('#damagereports').append(content),5000); 
                        }
                        else if (damageR.severity == 'High'){
                            var content = '<a href="#" class="list-group-item list-group-item-action">'+
                                '<div class="media" style="font-size: 13px;">'+
                                    '<img class="align-self-center" src="../img/high.png" width="40px" height="40px">'+
                                    '<div class="media-body">'+
                                        '<ul>'+
                                            '<li><small>Fault ID: '+damageR.fid+'</small></li>'+
                                            '<li><small>Severity: '+damageR.severity+'</small></li>'+
                                            '<li><small>Recorded on: '+damageR.day_occurrence+'</small></li>'+
                                        '</ul>'+
                                    '</div>'+
                                '</div>'+
                            '</a>';
                            var auto_refresh = setInterval($('#damagereports').append(content),5000); 
                        }
                    });
                }
            });

        var auto_refresh = setInterval (
            function(){
                $.ajax({
                    url: 'http://localhost/FaultDetectionGIS/Fault_GIS_AI_App/experiments/changecontent.php',
                    type: 'POST',
                    data: money,
                    dataType: 'html',
                    success: function(data){
                        if(data !== cacheData){
                            cacheData = data;
                            $('#money').html(data);
                        }
                    }
                });

                $.ajax({
                    url: 'http://localhost/FaultDetectionGIS/Fault_GIS_AI_App/experiments/changecontent.php',
                    type: 'POST',
                    data: industrial,
                    dataType: 'html',
                    success: function(data){
                        if(data !== cacheData){
                            cacheData = data;
                            $('#industrial').html(data);
                        }
                    }
                });

                $.ajax({
                    url: 'http://localhost/FaultDetectionGIS/Fault_GIS_AI_App/experiments/changecontent.php',
                    type: 'POST',
                    data: commercial,
                    dataType: 'html',
                    success: function(data){
                        if(data !== cacheData){
                            cacheData = data;
                            $('#commercial').html(data);
                        }
                    }
                });

                $.ajax({
                    url: 'http://localhost/FaultDetectionGIS/Fault_GIS_AI_App/experiments/changecontent.php',
                    type: 'POST',
                    data: residential,
                    dataType: 'html',
                    success: function(data){
                        if(data !== cacheData){
                            cacheData = data;
                            $('#residential').html(data);
                        }
                    }
                });

                $.ajax({
                    url: 'http://localhost/FaultDetectionGIS/Fault_GIS_AI_App/experiments/changecontent.php',
                    type: 'POST',
                    data: activeoutage,
                    dataType: 'html',
                    success: function(data){
                        if(data !== cacheData){
                            cacheData = data;
                            $('#activeoutage').html(data);
                        }
                    }
                });

            },300);

        var damageChart = new Chart(damagedAssets, {

            type: 'horizontalBar', // bar, horizontalBar, pie, line, doughnut, radar,polarArea
            data: {
                labels: ['Transformer', 'Meters', 'Poles', 'Overhead Lines', 'Switchgear', 'Others'],
                datasets: [{
                    label: 'Damaged Assets',
                    data: [10, 21, 2, 4, 1, 2],
                    backgroundColor: 'red'
                }]
            },
            options: {}

        });
    },


    initStatsMap: function () {


        /*var clientellAffected = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/poles.php",
            dataType: "json",
            success: console.log("affected clientelle data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })

        var processedLines = $.ajax({
            url: "http://localhost/faultDetectionGIS/Fault_GIS_AI_App/api/poles.php",
            dataType: "json",
            success: console.log("overheadLine data successfully loaded."),
            error: function (xhr) {
                alert(xhr.statusText)
            }
        })*/

        $.when(artisanloc).done(function () {


        });

    }

}