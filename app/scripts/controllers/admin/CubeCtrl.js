'use strict';
var app = angular.module('origApp.controllers');


app.controller('CubeCtrl', function($scope, $rootScope, $location,$state) {


  $scope.go = function(path) {
  $location.path(path);
 };
   $scope.isTabActive = function(stateKey) {
   	console.log('stateKey');
            return $state.includes('app.admin.' + stateKey);
          };

});