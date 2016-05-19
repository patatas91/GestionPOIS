/**
 * Created by diego on 29/04/2016.
 */
var app = angular.module('visitanteManager', ['ngCookies']);


var map;
var markers = [];
var markersBusqueda = [];
var directionsDisplay;

/*
 * Muestra la ruta en el mapa
 */
function displayRoute(lista) {

    for(i=0;i<markersBusqueda.length;i++) {
        markersBusqueda[i].setMap(null);
    }
    for(i=0;i<markers.length;i++) {
        markers[i].setMap(null);
    }

    // Reset the markers array
    markersBusqueda = [];
    markers = [];


    directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
    directionsDisplay.setMap(map); // map should be already initialized.

    var aux = lista[0];
    var start = new google.maps.LatLng(aux[0], aux[1]);

    var waypts = [];

    for(var i = 1; i<lista.length-1; i++){
        aux = lista[i];
        var stop = new google.maps.LatLng(aux[0], aux[1]);
        waypts.push({
            location: stop,
            stopover: true
        });
    }
    aux = lista[lista.length-1];
    var end = new google.maps.LatLng(aux[0], aux[1]);

    var request = {
        origin : start,
        destination : end,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode : google.maps.TravelMode.DRIVING
    };
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
        }
    });
}

/* Especifica un POI en el mapa */
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

    markersBusqueda.push(marker);
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
    for(i=0;i<markersBusqueda.length;i++) {
        markersBusqueda[i].setMap(null);
    }
    for(i=0;i<markers.length;i++) {
        markers[i].setMap(null);
    }

    // Reset the markers array
    markersBusqueda = [];
    markers = [];
    //quitar rutas
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

function initMap() {
    var mapOptions = {
        center: new google.maps.LatLng(40.4167754,-3.7492200000000366),
        zoom: 6
    }

    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

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

    setMarkers(markers);
}

app.controller('mainController', function($rootScope, $scope, $window, $http) {
    // when landing on the page, get all todos and show them
    $scope.map=true;
    $scope.showpoi=false;
    $scope.showlista=true;
    $scope.latitud;
    $scope.longitud;
    $scope.incorrecto = false;
    $scope.showregistro=true;
    $scope.showlogout=false;
    $scope.showoptions=false;
    $scope.cabeceraPois=true;
    $scope.cabeceraRutas=false;
    $scope.showlistaruta=false;
    $scope.showruta=false;
    $scope.showalert=false;

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
        $http.get('/pois')
            .success(function(data) {
                $scope.pois = data.message;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        initMap();
    };

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
        initMap();
    };

    /*
     * Cambia a vista POIS Favoritos
     */
    $scope.changeRoutes = function() {
        $scope.cabeceraRutas=true;
        $scope.cabeceraPois=false;
        $scope.showpoi=false;
        $scope.showlista=false;
        $scope.showlistaruta=true;
        $scope.showruta=false;
        initMap();
    };

    /* DEVUELVE LAS COORDENADAS DE UNA DIRECCION */
    $scope.sacarDir = function(address) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                reloadMarkersBuscar(results[0].geometry.location.lat(), results[0].geometry.location.lng());
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
                    $http.get('/users/'+data.message.user)
                        .success(function(data){
                            $scope.userPoi = data.message;
                        })
                        .error(function(data){
                            console.log('Error: '+ data);
                        });
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
     * Función para obtener las coordenadas de los diferentes puntos de la ruta
     */
    function obtenerPoi(lista, contador, resultado){
        if(contador < lista.length){
            $http.get('/pois/' + lista[contador])
                .success(function(data){
                    if(contador == 0){
                        $scope.inicio = data.message;
                    } else if (contador == lista.length -1){
                        $scope.final = data.message;
                    }
                    var punto = [data.message.latitud, data.message.longitud];
                    resultado.push(punto);
                    obtenerPoi(lista, contador + 1, resultado);
                })
                .error(function(data){
                    console.log('Error: ' + data);
                });
        } else{
            displayRoute(resultado);
        }
    }

    /* Cambia de la lista de Rutas a la info de una ruta */
    $scope.viewRuta = function(id) {
        if($scope.showlistaruta){  //Muestra la ruta
            $http.get('/rutas/'+id)
                .success(function(data){
                    $scope.myruta=data.message;
                    obtenerPoi(data.message.pois,0, []);
                    $scope.showlistaruta=false;
                    $scope.showruta = true;
                })
                .error(function(data){
                    console.log('Error: '+ data);
                });
        } else{ //Se vuelve al mapa con los pois
            reloadMarkers();
            resetfocus();
            $scope.showruta=false;
            $scope.showlistaruta=true;
        }
    };

    $scope.find = function() {
        for(i=0;i<markersBusqueda.length;i++) {
            markersBusqueda[i].setMap(null);
        }

        // Reset the markers array
        markersBusqueda = [];
            $scope.showpoi=false;
            $scope.showruta=false;
            $scope.showlistaruta=false;

            $http.get('/pois/busqueda/'+$scope.formData.word).success(function(data){
                    $scope.formData = {};
                    $scope.pois=data.message;

                    var message=data.message;
                        // Loop through markers and set map to null for each
                        for (var i=0; i<markers.length; i++) {
                            markers[i].setMap(null);
                        }
                        //markers = [];
                        for(i=0;i<message.length;i++){
                            var point = new google.maps.LatLng(message[i].latitud,message[i].longitud);
                            var marker = new google.maps.Marker({
                                position: point,
                                map: map,
                                animation: google.maps.Animation.DROP,
                                title: message[i].nombre
                            });
                            markersBusqueda.push(marker);
                            //setMarkers(message[i].latitud, message[i].longitud);
                        }

                }).error(function(data){
                    console.log('Error: '+ data);
                });
        $scope.showlista=true;
    };

    $scope.registro = function() {
        if(typeof($scope.formData.mail)=="undefined" | typeof($scope.formData.pass)=="undefined" | $scope.formData.mail=="" |$scope.formData.pass==""){
            $scope.showalert=true;
        }else{
            $scope.showalert=false;
            $http.post('/users/registro', $scope.formData)
                .success(function(data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.users = data.message;
                    $scope.user = data.user;
                    $scope.datosAcceso=true;
                    $window.location.href= '/acceso';
                })
                .error(function(data) {
                    $scope.incorrecto=true;
                    console.log('Error: ' + data);
                });

        }
    };
});




