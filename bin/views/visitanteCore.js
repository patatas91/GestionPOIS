/**
 * Created by diego on 29/04/2016.
 */
angular.module('visitanteManager',[],function($locationProvider){
    $locationProvider.html5Mode(true);
});

var map;
var markers = [];
var markersUltimo = [];

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

function mainController($scope, $http) {
    // when landing on the page, get all todos and show them
    $scope.map=true;
    $scope.showpoi=false;
    $scope.showlista=true;
    $scope.latitud;
    $scope.longitud;

    $http.get('/pois')
        .success(function(data) {
            $scope.pois = data.message;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

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
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.46366700000001, lng: -3.7492200000000366},
        zoom: 6
    });

    map2 = new google.maps.Map(document.getElementById('map2'), {
        center: {lat: 40.46366700000001, lng: -3.7492200000000366},
        zoom: 6
    });

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



