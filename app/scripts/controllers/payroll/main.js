'use strict';
angular.module('origApp.controllers')
.controller('PayrollMainController', function($scope, $rootScope) {
  $rootScope.breadcrumbs = [
    { link: '/', text: 'Home'},
    { text: 'Payroll'}
  ];
});