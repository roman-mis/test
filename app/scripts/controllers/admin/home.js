'use strict';
var app = angular.module('origApp.controllers');
app.controller('adminHomeController', function($scope, $rootScope) {

  $rootScope.breadcrumbs = [{link:'/', text:'Home'}, {link: '/admin/home', text: 'Admin'}];

});