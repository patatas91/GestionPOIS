/**
 * Created by diego on 29/04/2016.
 */
var app = angular.module('adminManager', ['ngCookies']);
app.controller('mainController', function($rootScope, $scope, $window, $http, $cookies) {
    /* Varibales utilizadas */
    var map;
    $scope.map=true;
    $scope.showpoi=false;
    $scope.listUser=true;
    $scope.newUser=false;
    $scope.delUser=false;
    $scope.datosAcceso=false;
    $scope.formData={};
    $scope.estadistica = true;
    $scope.estadistica2 = false;
    $scope.estadistica3 = false;
    $scope.numStatic = 0;

    /* Obtener los POIS */
    $http.get('/pois')
        .success(function(data) {
            $scope.pois = data.message;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    /*Obtener los Usuarios */
    $http.get('/users')
        .success(function(data) {
            $scope.users = data.message;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/me')
        .success(function(data) {
            $scope.userMe = data.message;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    /* Obtener Estadística de Ultmos Accesos */
    $http.get('/chart/ultimosAccesos')
        .success(function(data){
            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx,data.message);
        })
        .error(function(data){
            console.log('Error: ' + data);
        });

    /* Obtener Estadistica de Altas y Bajas */
    $http.get('/chart/altasYbajas')
        .success(function(data){
            var ctx = document.getElementById("myChart2");
            $scope.myChart2 = new Chart(ctx,data.message);
        })
        .error(function(data){
            console.log('Error: ' + data);
        });

    /* Obtener estadisticas sobre los POIS */
    $http.get('/chart/pois')
        .success(function(data){
            var ctx = document.getElementById("myChart3");
            $scope.myChart3 = new Chart(ctx,data.message);
        })
        .error(function(data){
            console.log('Error: ' + data);
        });

    /* Funcion para pasar a la siguiente estadistica */
    $scope.nextStatic = function(id) {
        if($scope.numStatic == 0){
            $scope.estadistica = false;
            $scope.estadistica2 = true;
            $scope.numStatic = 1;
        } else if ($scope.numStatic == 1){
            $scope.estadistica2 = false;
            $scope.estadistica3 = true;
            $scope.numStatic = 2;
        } else {
            $scope.estadistica3 = false;
            $scope.estadistica = true;
            $scope.numStatic = 0;
        }

    }

    /* Función para dejar de mostrar el mapa y mostrar la especificacion de un POI y viceversa*/
    $scope.viewPoi = function(id) {
        if(id != 0){
            $scope.map=false;
            $http.get('/pois/'+id)
                .success(function(data){
                    $scope.mypoi=data.message;
                })
                .error(function(data){
                    console.log('Error: '+ data);
                });
            $scope.showpoi=true;
        }
        else{
            $scope.showpoi=false;
            $scope.map=true;
        }
    };

    /* Funcion para mostrar la lista de usuarios, el formulario para crear uno o la lista para permitir eliminar Usuarios */
    $scope.viewUser = function(id){
        if(id == 0){
            $scope.listUser=false;
            $scope.delUser=false;
            $scope.newUser=true;
        } else if(id == 1){
            $scope.newUser=false;
            $scope.listUser=false;
            $scope.delUser=true;
        } else if(id == 2){
            $scope.delUser=false;
            $scope.newUser=false;
            $scope.datosAcceso=false;
            $scope.listUser=true;
        }
        else{
            $scope.delUser=false;
            $scope.newUser=false;
            $scope.listUser=true;
        }
    }

    /* Función que realiza una petición para crear un Usuario */
    $scope.createUser = function() {
        $http.post('/users', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.users = data.message;
                $scope.user = data.user;
                $scope.datosAcceso=true;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    /* Función que cierra sesión (elimina la cookie) */
    $scope.logout = function() {
            $cookies.remove("token");
            $window.location.href= '/login';
    };

    /* Función que hace una petición para eliminar un usuario */
    $scope.deleteUser = function(id) {
        $http.delete('/users/' + id)
            .success(function(data) {
                $scope.users = data.message;
                $scope.datosAcceso=true;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
})

/* Función que inicializa el Mapa */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.4167754, lng: -3.7037901999999576},
        zoom: 6
    });
    var markers = [];
    $.get('/pois', function (res) {
        var message = res.message;
        if (!res.error) {
            for (i = 0; i < message.length; i++) {
                var marker = new google.maps.Marker({
                    position: {lat: message[i].latitud, lng: message[i].longitud},
                    map: map,
                    title: message[i].nombre
                });
                marker.setMap(map)
            }
        }
    });
}





