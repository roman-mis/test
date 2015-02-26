'use strict';
angular.module('origApp').config(function($stateProvider) {
  $stateProvider

  .state('app.payroll', {
    url: '/payroll',
    template: '<div ui-view></dev>',
    controller: 'PayrollMainController'
  })
  .state('app.payroll.home', {
    url: '/home',
    templateUrl: 'views/payroll/payrollHome.html',
  })
  .state('app.payroll.viewAll', {
    url: '/viewAll',
    templateUrl: 'views/payroll/viewAll.html',
  })
  .state('app.payroll.runPayroll', {
    url: '/runPayroll',
    templateUrl: 'views/payroll/runPayroll.html',
    controller: 'runPayrollController'
  });
});