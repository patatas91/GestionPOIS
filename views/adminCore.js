/**
 * Created by diego on 29/04/2016.
 */
angular.module('adminManager',[],function($locationProvider){
    $locationProvider.html5Mode(true);
});

var map;

function mainController($scope, $http) {
    // when landing on the page, get all todos and show them
    $scope.map=true;
    $scope.showpoi=false;
    $scope.listUser=true;
    $scope.newUser=false;
    $scope.delUser=false;
    $scope.datosAcceso=false;
    $scope.formData={};

    $http.get('/pois')
        .success(function(data) {
            $scope.pois = data.message;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/users')
        .success(function(data) {
            $scope.users = data.message;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

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

    $scope.viewUser = function(id){
        if(id == 0){
            $scope.listUser=false;
            $scope.delUser=false;
            $scope.newUser=true;
        } else if(id == 1){
            $scope.newUser=false;
            $scope.listUser=false;
            $scope.delUser=true;
        } else if(id=2){
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
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.46366700000001, lng: -3.7492200000000366},
        zoom: 6
    });
    var markers=[];
    $.get('/pois', function(res){
        var message=res.message;
        if(!res.error){
            for(i=0;i<message.length;i++){
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


