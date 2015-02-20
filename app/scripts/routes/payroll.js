'use strict';
angular.module('origApp').config(function($stateProvider) {
  $stateProvider

  .state('app.payroll', {
    url: '/payroll',
    template: '<div ui-view>hello</dev>'
  })
  .state('app.payroll.home', {
    url: '/home',
    templateUrl: 'views/payroll/payrollHome.html',
    controller: 'PayrollMainController'
  })
  .state('app.test', {
    url: '/test',
    templateUrl: 'views/payroll/createValidation.html',
    controller: 'PayrollCreateValidationController'
  })
  .state('app.payroll.createValidation', {
    url: '/createValidation',
    templateUrl: 'views/payroll/createValidation2.html',
    controller: 'PayrollCreateValidationController'
  });
});