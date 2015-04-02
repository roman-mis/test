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
    controller: 'PayrollHomeController'
  })
  .state('app.payroll.view', {
    url: 'view/:type',
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
  })
  .state('app.payroll.payroll', {
    url:'/payroll',
    templateUrl:'views/payroll/payrollpayroll.html',
    controller:'payrollPayrollCtrl'
  })
  .state('app.payroll.expenses', {
    url:'/expenses',
    templateUrl:'views/payroll/expenses.html',
    controller:'payrollExpensesCtrl'
  })
  .state('app.payroll.actionRequest',{

    url:'/actionRequest',
    templateUrl:'views/actionRequest/home.html',
    controller:'actionRequestController'
  })


});
