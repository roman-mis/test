'use strict';
var app = angular.module('origApp.controllers');


app.controller('CubeCtrl', function($scope, $rootScope, $location,$state) {

  $rootScope.breadcrumbs = [{link:'/', text:'Home'}, {link: '/admin/home', text: 'Admin'}];

  $scope.go = function(path) {
  $location.path(path);
 };
   $scope.isTabActive = function(stateKey) {
   	console.log('stateKey');
            return $state.includes('app.admin.' + stateKey);
          };

});