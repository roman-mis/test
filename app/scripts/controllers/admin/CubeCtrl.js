'use strict';
var app = angular.module('origApp.controllers');


app.controller('CubeCtrl', function($scope, $rootScope, $location) {

  $rootScope.breadcrumbs = [{link:'/', text:'Home'}, {link: '/admin/home', text: 'Admin'}];

  $scope.go = function(path) {
  $location.path(path);
 };

});