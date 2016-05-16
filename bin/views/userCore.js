/**
 * Created by patatas91 on 30/04/16.
 */
angular.module('userManager',[],function($locationProvider){
    $locationProvider.html5Mode(true);
});

var map;
var markers = [];
var markersUltimo = [];
var lista = [];
var directionsDisplay;
var id_user = "57349ba848d3e577329ac669";
var myChart;
var myChart2;
var myChart3;
var myChart4;
var myChart5;


/**
 * Muestra un POI en el mapa
 * @param lat
 * @param long
 */
function setMarkers(lat, long) {
    for (var i=0; i<markers.length; i++) {
        markers[i].setMap(null);
    }
    var point = new google.maps.LatLng(lat,long);
    var marker = new google.maps.Marker({
        position: point,
        map: map,
        animation: google.maps.Animation.DROP
    });

    markersUltimo.push(marker);
}

/**
 * Cambia el zoom del mapa y se centra en un POI
 * @param lat
 * @param long
 * @param zoom
 */
function focusPoi(lat, long, zoom) {
    map.panTo(new google.maps.LatLng(lat, long));
    map.setZoom(zoom);
}

/**
 * Resetea el focus del mapa
 */
function resetfocus() {
    map.panTo(new google.maps.LatLng(40.46366700000001, -3.7492200000000366));
    map.setZoom(6);
}

/**
 * Actualiza los markers en el mapa
 */
function reloadMarkers() {
    for(i=0;i<markersUltimo.length;i++) {
        markersUltimo[i].setMap(null);
    }
    for(i=0;i<markers.length;i++) {
        markers[i].setMap(null);
    }

    // Reset the markers array
    markersUltimo = [];
    markers = [];
    //quitar rutas
    //directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
    directionsDisplay.setMap(null);

    $.get('/pois', function(res){
        var message=res.message;
        if(!res.error){
            for(i=0;i<message.length;i++){
                var point = new google.maps.LatLng(message[i].latitud,message[i].longitud);
                var marker = new google.maps.Marker({
                    position: point,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: message[i].nombre
                });
                // Push marker to markers array
                markers.push(marker);
            }
        }
    });
}

/**
 * Mustra la ruta entre N puntos
 * @param lista
 */
function displayRoute(lista) {

    for(i=0;i<markersUltimo.length;i++) {
        markersUltimo[i].setMap(null);
    }
    for(i=0;i<markers.length;i++) {
        markers[i].setMap(null);
    }

    // Reset the markers array
    markersUltimo = [];
    markers = [];
    var sizeLista = lista.length;

    //directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
    directionsDisplay.setMap(map); // map should be already initialized.

    //var start = new google.maps.LatLng(41.6488226, -0.88908530000003);
    //var end = new google.maps.LatLng(41.3850639, 2.1734034999999494);
    var start = new google.maps.LatLng(lista[0], lista[1]);

    /*
     var waypts = [];

     for(i=2;i<lista.length;i+2) {
     if(lista.length>4) {
     stop = new google.maps.LatLng(lista[i], lista[i+1])
     waypts.push({
     location: stop,
     stopover: true
     });
     } else {
     var end = new google.maps.LatLng(lista[lista.length-1], lista[lista.length]);
     }
     }
     */

    var end = new google.maps.LatLng(lista[sizeLista-2], lista[sizeLista-1]);

    var request = {
        origin : start,
        destination : end,
        //waypoints: waypts,
        //optimizeWaypoints: true,
        travelMode : google.maps.TravelMode.DRIVING
    };
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function mainController($scope, $http) {
    // when landing on the page, get all todos and show them
    $scope.showpoi=false;
    $scope.showlista=true;
    $scope.latitud;
    $scope.longitud;
    $scope.tablaEdit=true;
    $scope.edicion=false;
    $scope.tablaEditRuta=true;
    $scope.edicionRuta=false;
    $scope.listaPoisRuta=true;
    $scope.showpoiRuta=false;
    $scope.showlistaruta=false;
    $scope.showruta=false;
    $scope.cabeceraPois=true;
    $scope.cabeceraRutas=false;
    $scope.formData = {};

    $http.get('/pois')
        .success(function(data) {
            $scope.pois = data.message;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/rutas')
        .success(function(data) {
            $scope.rutas = data.message;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/users/'+id_user)
        .success(function(data){
            $scope.user=data.message;
        })
        .error(function(data){
            console.log('Error: '+ data);
        });

    $http.get('/chart/bestpois')
        .success(function(data){
            var ctx = document.getElementById("myChart");
            myChart = new Chart(ctx,data.message);
        })
        .error(function(data){
            console.log('Error: ' + data);
        });

    $http.get('/chart/bestroutes')
        .success(function(data){
            var ctx = document.getElementById("myChart2");
            myChart2 = new Chart(ctx,data.message);
        })
        .error(function(data){
            console.log('Error: ' + data);
        });

    $http.get('/chart/bestusers')
        .success(function(data){
            var ctx = document.getElementById("myChart3");
            myChart3 = new Chart(ctx,data.message);
        })
        .error(function(data){
            console.log('Error: ' + data);
        });

    $http.get('/chart/lastpois')
        .success(function(data){
            var ctx = document.getElementById("myChart4");
            myChart4 = new Chart(ctx,data.message);
        })
        .error(function(data){
            console.log('Error: ' + data);
        });

    $http.get('/chart/lastroutes')
        .success(function(data){
            var ctx = document.getElementById("myChart5");
            myChart5 = new Chart(ctx,data.message);
        })
        .error(function(data){
            console.log('Error: ' + data);
        });

    /**
     * Actualiza los charts
     */
    $scope.refreshStats = function() {
        myChart.destroy();
        $http.get('/chart/bestpois')
            .success(function(data){
                var ctx = document.getElementById("myChart");
                myChart = new Chart(ctx,data.message);
            })
            .error(function(data){
                console.log('Error: ' + data);
            });
        myChart2.destroy();
        $http.get('/chart/bestroutes')
            .success(function(data){
                var ctx = document.getElementById("myChart2");
                myChart2 = new Chart(ctx,data.message);
            })
            .error(function(data){
                console.log('Error: ' + data);
            });
        myChart3.destroy();
        $http.get('/chart/bestusers')
            .success(function(data){
                var ctx = document.getElementById("myChart3");
                myChart3 = new Chart(ctx,data.message);
            })
            .error(function(data){
                console.log('Error: ' + data);
            });
        myChart4.destroy();
        $http.get('/chart/lastpois')
            .success(function(data){
                var ctx = document.getElementById("myChart4");
                myChart4 = new Chart(ctx,data.message);
            })
            .error(function(data){
                console.log('Error: ' + data);
            });
        myChart5.destroy();
        $http.get('/chart/lastroutes')
            .success(function(data){
                var ctx = document.getElementById("myChart5");
                myChart5 = new Chart(ctx,data.message);
            })
            .error(function(data){
                console.log('Error: ' + data);
            });
    }
    
    $scope.logout = function() {
        //$cookies.remove("token");
        //$window.location.href= '/login';
    };

    /**
     * Cambia a vista POIs
     */
    $scope.changePois = function() {
        $scope.cabeceraPois=true;
        $scope.cabeceraRutas=false;
        $scope.showpoi=false;
        $scope.showlista=true;
        $scope.showlistaruta=false;
        $scope.showruta=false;
    }

    /**
     * Cambia a vista rutas
     */
    $scope.changeRoutes = function() {
        $scope.cabeceraRutas=true;
        $scope.cabeceraPois=false;
        $scope.showpoi=false;
        $scope.showlista=false;
        $scope.showlistaruta=true;
        $scope.showruta=false;
    }

    /**
     * Devuelve las coordenadas de una direccion
     * @param address
     */
    $scope.sacarDir = function(address) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $scope.latitud=results[0].geometry.location.lat();
                $scope.longitud=results[0].geometry.location.lng();
            } else {
                alert('Debe introducir una direccion');
            }
        });
    };

    /**
     * Cambia lista y vista de un POI
     * @param id
     */
    $scope.viewPoi = function(id) {
        if($scope.showlista){
            $scope.showlista=false;
            $http.get('/pois/'+id)
                .success(function(data){
                    $scope.mypoi=data.message;
                    //
                    setMarkers(data.message.latitud, data.message.longitud);
                    focusPoi(data.message.latitud, data.message.longitud, 18);
                })
                .error(function(data){
                    console.log('Error: '+ data);
                });
            $scope.showpoi=true;
        }
        else{
            reloadMarkers();
            resetfocus();
            $scope.showpoi=false;
            $scope.showlista=true;
        }
    };

    /**
     * Cambia lista y vista de una ruta
     * @param id
     */
    $scope.viewRuta = function(id) {
        if($scope.showlistaruta){
            $scope.showlistaruta=false;
            $http.get('/rutas/'+id)
                .success(function(data){
                    $scope.myruta=data.message;
                    //$scope.tuvieja=data.message.pois
                    //TABLA CON LOS POIS DE LA RUTA
                    var tablaPois=data.message.pois;
                    var sizeTabla = tablaPois.length;
                    //var count=0;
                    var start=0;
                    var end=0;
                    //for(i=0;i<tablaPois.length;i++) {
                    //  count=i;
                    //}
                    //NUMERO DE POIS
                    $scope.numPois=sizeTabla;

                    //$scope.listPois=lista;
                    //DATOS POIS
                    $http.get('/pois/'+tablaPois[0])
                        .success(function(data){
                            $scope.inicio=data.message;
                            //start=new google.maps.LatLng(data.message.latitud, data.message.longitud);
                            lista.push(data.message.latitud);
                            lista.push(data.message.longitud);
                        })
                        .error(function(data){
                            console.log('Error: '+ data);
                        });
                    $http.get('/pois/'+tablaPois[sizeTabla-1])
                        .success(function(data){
                            $scope.final=data.message;
                            //end=new google.maps.LatLng(data.message.latitud, data.message.longitud);
                            lista.push(data.message.latitud);
                            lista.push(data.message.longitud);
                        })
                        .error(function(data){
                            console.log('Error: '+ data);
                        });
                    /*
                     for(i=0;i<tablaPois.length;i++) {
                     $http.get('/pois/'+tablaPois[i])
                     .success(function(data){
                     $scope.inicio=data.message;
                     //start=new google.maps.LatLng(data.message.latitud, data.message.longitud);
                     lista.push(data.message.latitud);
                     lista.push(data.message.longitud);
                     })
                     .error(function(data){
                     console.log('Error: '+ data);
                     });
                     }*/
                    //displayRoute();
                    displayRoute(lista);
                })
                .error(function(data){
                    console.log('Error: '+ data);
                });
            $scope.showruta=true;
        }
        else{
            reloadMarkers();
            resetfocus();
            $scope.showruta=false;
            $scope.showlistaruta=true;
        }
    };

    /**
     * Añadir un nuevo POI
     */
    $scope.addPoi = function() {
        var r = confirm('¿Desea añadir el nuevo Poi?');
        if(r==true) {
            if($scope.formData.palabrasClave!=undefined) {
                $scope.formData.palabrasClave = $scope.formData.palabrasClave.split(', ');
            }
            $scope.formData.user = id_user;
            $http.post('/pois', $scope.formData)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.pois = data.message;
                    $scope.poi = data.poi;
                    reloadMarkers();
                    alert('Poi añadido correctamente');

                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    alert('Error al añadir el Poi');
                });
        }
    };

    /**
     * Eliminar un POI
     * @param id
     */
    $scope.deletePoi = function(id) {
        var r = confirm('¿Desea eliminar el Poi seleccionado?');
        if(r==true) {
            $http.delete('/pois/' + id)
                .success(function(data) {
                    $scope.pois = data.message;
                    reloadMarkers();
                    alert('Poi eliminado correctamente');
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    alert('Error al eliminar el Poi');
                });
        }
    };

    /**
     * Duplicar un POI
     * @param id
     */
    $scope.duplicatePoi = function(id) {
        var r = confirm('¿Desea duplicar el Poi seleccionado?');
        if(r==true) {
            $http.get('/pois/'+id)
                .success(function(data){
                    $http.post('/pois', data.message)
                        .success(function(data) {
                            $scope.pois = data.message;
                            $scope.poi = data.poi;
                            reloadMarkers();
                            alert('Poi duplicado correctamente');
                        })
                        .error(function(data) {
                            console.log('Error: ' + data);
                            alert('Error al duplicar el Poi');
                        });

                })
                .error(function(data){
                    console.log('Error: '+ data);
                    alert('Error al duplicar el Poi');
                });
        }
    };

    /**
     * Editar un POI
     * @param id
     */
    $scope.editPoi = function(id) {
        var r = confirm('¿Desea editar el Poi seleccionado?');
        if(r==true) {
            if($scope.formData.palabrasClave!=undefined) {
                $scope.formData.palabrasClave = $scope.formData.palabrasClave.split(', ');
            }
            $http.put('/pois/' + id, $scope.formData)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.pois = data.message;
                    $scope.poi = data.poi;
                    reloadMarkers();
                    alert('Poi editado correctamente');
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    alert('Error al editar el Poi');
                });
        }
        $scope.tablaEdit=true;
        $scope.edicion=false;
    };

    /**
     * Muestra / Oculta la parte de edicion de un POI
     * @param op
     * @param id
     */
    $scope.showEdit = function(op, id) {
        if(op==1){
            $http.get('/pois/'+id)
                .success(function(data){
                    $scope.datosEdit=data.message;

                })
                .error(function(data){
                    console.log('Error: '+ data);
                });
            $scope.tablaEdit=false;
            $scope.edicion=true;
        }
        else {
            $scope.tablaEdit=true;
            $scope.edicion=false;
        }
    };

    /**
     * Cambia lista y vista de una ruta
     * @param id
     */
    $scope.viewPoiRuta = function(id) {
        if($scope.listaPoisRuta){
            $scope.listaPoisRuta=false;
            $http.get('/pois/'+id)
                .success(function(data){
                    $scope.mypoi=data.message;
                    //
                })
                .error(function(data){
                    console.log('Error: '+ data);
                });
            $scope.showpoiRuta=true;
        }
        else{
            $scope.showpoiRuta=false;
            $scope.listaPoisRuta=true;
        }
    };

    /**
     * Añadir una nueva ruta
     */
    $scope.addRoute = function() {
        var r = confirm('¿Desea añadir la nueva ruta?');
        if(r==true) {
            if($scope.formData.pois!=undefined) {
                $scope.formData.pois = $scope.formData.pois.split(', ');
            }
            $scope.formData.user = id_user;
            $http.post('/rutas', $scope.formData)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.rutas = data.message;
                    $scope.formData = {};
                    alert('Ruta añadida correctamente');

                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    alert('Error al añadir la ruta');
                });
        }
    };

    /**
     * Eliminar una ruta
     * @param id
     */
    $scope.deleteRuta = function(id) {
        var r = confirm('¿Desea eliminar la ruta seleccionada?');
        if(r==true) {
            $http.delete('/rutas/' + id)
                .success(function(data) {
                    $scope.rutas = data.message;
                    //reloadMarkers();
                    alert('Ruta eliminada correctamente');
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    alert('Error al eliminar la ruta');
                });
        }
    };

    /**
     * Duplicar una ruta
     * @param id
     */
    $scope.duplicateRuta = function(id) {
        var r = confirm('¿Desea duplicar la ruta seleccionado?');
        if(r==true) {
            $http.get('/rutas/'+id)
                .success(function(data){
                    $http.post('/rutas', data.message)
                        .success(function(data) {
                            $scope.rutas = data.message;
                            $scope.ruta = data.ruta;
                            reloadMarkers();
                            alert('Ruta duplicada correctamente');
                        })
                        .error(function(data) {
                            console.log('Error: ' + data);
                            alert('Error al duplicar la ruta');
                        });

                })
                .error(function(data){
                    console.log('Error: '+ data);
                    alert('Error al duplicar la ruta');
                });
        }
    };

    /**
     * Editar una ruta
     * @param id
     */
    $scope.editRuta = function(id) {
        var r = confirm('¿Desea editar la ruta seleccionado?');
        if(r==true) {
            if($scope.formData.pois!=undefined) {
                $scope.formData.pois = $scope.formData.pois.split(', ');
            }
            $http.put('/rutas/' + id, $scope.formData)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.rutas = data.message;
                    $scope.ruta = data.ruta;
                    //reloadMarkers();
                    alert('Ruta editada correctamente');
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    alert('Error al editar la ruta');
                });
        }
        $scope.tablaEditRuta=true;
        $scope.edicionRuta=false;
    };

    /**
     * Muestra / Oculta la parte de edicion de una ruta
     * @param op
     * @param id
     */
    $scope.showEditRuta = function(op, id) {
        if(op==1){
            $http.get('/rutas/'+id)
                .success(function(data){
                    $scope.datosEditRuta=data.message;

                })
                .error(function(data){
                    console.log('Error: '+ data);
                });
            $scope.tablaEditRuta=false;
            $scope.edicionRuta=true;
        }
        else {
            $scope.tablaEditRuta=true;
            $scope.edicionRuta=false;
        }
    };

    /**
     * Editar un usuario
     */
    $scope.editUser = function() {
        var r = confirm('¿Desea editar su cuenta?');
        if(r==true) {
            if($scope.formData.pass == $scope.formData.pass2) {
                $http.put('/users/' + id_user, $scope.formData)
                    .success(function(data) {
                        $scope.formData = {};
                        $scope.user = data.message;
                        alert('Usuario editado correctamente');
                        $http.get('/users/'+id_user)
                            .success(function(data){
                                $scope.user=data.message;
                            })
                            .error(function(data){
                                console.log('Error: '+ data);
                            });
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                        alert('Error al editar el usuario');
                    });
            } else {
                alert('¡Las contraseñas no coinciden!');
            }
        }
    };
}

/**
 * Inicializa el mapa
 */
function initMap() {
    var mapOptions = {
        center: new google.maps.LatLng(40.4167754,-3.7492200000000366),
        zoom: 6
    }

    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    $.get('/pois', function(res){
        var message=res.message;
        if(!res.error){
            for(i=0;i<message.length;i++){
                var marker = new google.maps.Marker({
                    position: {lat: message[i].latitud, lng: message[i].longitud},
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: message[i].nombre
                });
                markers.push(marker);
            }
        }
    });
}


