/**
 * Created by diego on 06/05/2016.
 */
var app = angular.module('login', []);
app.controller('mainController', function($rootScope, $scope, $window, $http) {
    $scope.formData={};
    $scope.incorrecto = false;

    $scope.autentificar = function() {

        $http.post('/auth', $scope.formData)
            .success(function(data) {
                if(data.error == false){
                    $scope.incorrecto = false;
                    $scope.formData = {};
                    $window.location.href= data.next;
                } else{
                    $scope.incorrecto = true;
                }

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
});