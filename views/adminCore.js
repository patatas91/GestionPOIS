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
    $scope.deleteUser=false;

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
        if($scope.map){
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
            $scope.deleteUser=false;
            $scope.newUser=true;
        } else if(id == 1){
            $scope.listUser=false;
            $scope.deleteUser=true;
            $scope.newUser=false;
        } else{
            $scope.listUser=true;
            $scope.deleteUser=false;
            $scope.newUser=false;
        }
    }

    $scope.viewMap = function() {

    }
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


