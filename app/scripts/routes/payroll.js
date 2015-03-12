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
  })
  .state('app.payroll.endPeriod', {
    url:'/endPeriod',
    templateUrl: 'views/payroll/endPeriod.html'
  });
  // .state('app.payroll.AOE', {
  //   url: '/AOE',
  //   templateUrl: 'views/payroll/AOE.html',
  //   controller: 'AOEController'
  // });

});