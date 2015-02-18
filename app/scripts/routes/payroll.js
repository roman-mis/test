'use strict';
angular.module('origApp').config(function($stateProvider) {
  $stateProvider
    .state('app.payroll', {
      url: '/payroll',
      templateUrl: 'views/payroll/payrollHome.html',
      controller: 'payrollController'
    });
});