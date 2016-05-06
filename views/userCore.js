/**
 * Created by patatas91 on 30/04/16.
 */
angular.module('userManager',[],function($locationProvider){
    $locationProvider.html5Mode(true);
});

var map;
//var map2;
var markers = [];
var markersUltimo = [];
//var listaPois = [];
//var markersBuscar = [];

function setMarkers(lat, long) {
    // Loop through markers and set map to null for each
   for (var i=0; i<markers.length; i++) {
        markers[i].setMap(null);
   }

    var marker = new google.maps.Marker({
        position: {lat: lat, lng: long},
        map: map,
        animation: google.maps.Animation.DROP
    });

    markersUltimo.push(marker);
}

function focusPoi(lat, long, zoom) {
    //map.setCenter(new google.maps.LatLng(lat, long));
    map.panTo(new google.maps.LatLng(lat, long));
    map.setZoom(zoom);
}

function resetfocus() {
    map.panTo(new google.maps.LatLng(40.46366700000001, -3.7492200000000366));
    map.setZoom(6);
}

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
                // Push marker to markers array
                markers.push(marker);
            }
        }
    });
}

/*
function reloadMarkersBuscar(lat, long) {

    for(i=0;i<markersBuscar.length;i++) {
        markersBuscar[i].setMap(null);
    }

    markersBuscar = [];

    var marker = new google.maps.Marker({
        position: {lat: lat, lng: long},
        map: map2,
        animation: google.maps.Animation.DROP,
    });
    // Push marker to markers array
    markersBuscar.push(marker);
    map2.panTo(new google.maps.LatLng(lat, long));
    map2.setZoom(12);
}
*/

function mainController($scope, $http) {
    // when landing on the page, get all todos and show them
    $scope.showpoi=false;
    $scope.showlista=true;
    $scope.latitud;
    $scope.longitud;
    $scope.tablaEdit=true;
    $scope.edicion=false;
    $scope.listaPoisRuta=true;
    $scope.showpoiRuta=false;
    $scope.showlistaruta=false;
    $scope.showruta=false;
    $scope.cabeceraPois=true;
    $scope.cabeceraRutas=false;

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

    /* CAMBIA A VISTA POIS */
    $scope.changePois = function() {
        $scope.cabeceraPois=true;
        $scope.cabeceraRutas=false;
        $scope.showpoi=false;
        $scope.showlista=true;
        $scope.showlistaruta=false;
        $scope.showruta=false;
        // RESET MAP
    }

    /* CAMBIA A VISTA RUTAS */
    $scope.changeRoutes = function() {
        $scope.cabeceraRutas=true;
        $scope.cabeceraPois=false;
        $scope.showpoi=false;
        $scope.showlista=false;
        $scope.showlistaruta=true;
        $scope.showruta=false;
        //RESET MAP
    }

    /* DEVUELVE LAS COORDENADAS DE UNA DIRECCION */
    $scope.sacarDir = function(address) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //reloadMarkersBuscar(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                $scope.latitud=results[0].geometry.location.lat();
                $scope.longitud=results[0].geometry.location.lng();
                //alert(results[0].geometry.location.lat()+'-'+results[0].geometry.location.lng());
            } else {
                alert('Debe introducir una direccion');
            }
        });
    };
    
    /* CAMBIA LISTA Y VISTA DE UN POI */
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

    /* CAMBIA LISTA Y VISTA DE UNA RUTA */
    $scope.viewRuta = function(id) {
        if($scope.showlistaruta){
            $scope.showlistaruta=false;
            $http.get('/rutas/'+id)
                .success(function(data){
                    $scope.myruta=data.message;

                    //////
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
    
    /* AÑADIR UN NUEVO POI */
    $scope.addPoi = function() {
        var r = confirm('¿Desea añadir el nuevo Poi?');
        if(r==true) {
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

    /* ELIMINAR UN POI */
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

    /* DUPLICAR UN POI */
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

    /* EDITAR UN POI */
    $scope.editPoi = function(id) {
        var r = confirm('¿Desea editar el Poi seleccionado?');
        if(r==true) {
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

    /* CAMBIA LISTA Y VISTA DE UN POI */
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

    /* AÑADIR UNA NUEVA RUTA */
    $scope.addRoute = function() {
        var r = confirm('¿Desea añadir la nueva ruta?');
        if(r==true) {
            var tablaPois = [];
            var listaPois = [$scope.formData.get(pois)];
            for(i=0;i<listaPois.length;i++) {
                $http.get('/pois/'+listaPois[i])
                    .success(function(data){
                        tablaPois[data]
                    })
                    .error(function(data){
                        console.log('Error: '+ data);
                    });
            }
            var data = $.param({
                nombre: $scope.formData.get(nombre),
                descripcion: $scope.formData.get(descripcion),
                pois: tablaPois
            });

            $http.post('/rutas', data)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.rutas = data.message;
                    $scope.ruta = data.ruta;                    
                    alert('Ruta añadida correctamente');

                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    alert('Error al añadir la ruta');
                });
        }
    };
    
    $scope.calculateDistance = function() {
        var totalDistance = 0;
        var partialDistance = [];
        partialDistance.length = $scope.markers.length - 1;

        for(var i = 0; i < partialDistance.length; i++){
            var p1 = $scope.markers[i];
            var p2 = $scope.markers[i+1];

            var R = 6378137; // Earth’s mean radius in meter
            var dLat = $scope.rad(p2.position.lat() - p1.position.lat());
            var dLong = $scope.rad(p2.position.lng() - p1.position.lng());
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos($scope.rad(p1.position.lat())) * Math.cos($scope.rad(p2.position.lat())) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            totalDistance += R * c / 1000; //distance in Km
            partialDistance[i] = R * c / 1000;
        }
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: {lat: 40.46366700000001, lng: -3.7492200000000366},
        zoom: 6
    });

    /*
    map2 = new google.maps.Map(document.getElementById('map_canvas2'), {
        center: {lat: 40.46366700000001, lng: -3.7492200000000366},
        zoom: 6
    });
    */

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
                // Push marker to markers array
                markers.push(marker);
            }
        }
    });
    setMarkers(markers);
}



