'use strict';
angular.module('origApp').config(function($stateProvider) {
  $stateProvider
    .state('app.agencies', {
      url: '/agencies',
      templateUrl: 'views/agency/list.html',
      controller: 'AgencyListController'
    })
    .state('app.agency', {
      url: '/agencies/:agencyId',
      abstract: true,
      templateUrl: 'views/agency/main.html',
      controller: 'AgencyMainController'
    })
    .state('app.agency.home', {
      url: '',
      templateUrl: 'views/agency/home.html',
      controller: 'AgencyHomeController'
    })
    .state('app.agency.payroll', {
      url: '/payroll',
      templateUrl: 'views/agency/payroll.html',
      controller: 'AgencyPayrollController'
    })
    .state('app.agency.consultants', {
      url: '/consultants',
      templateUrl: 'views/agency/consultants.html',
      controller: 'AgencyConsultantsController'
    })
    .state('app.agency.candidates', {
      url: '/candidates',
      templateUrl: 'views/agency/candidates.html',
      controller: ''
    })
    .state('app.agency.margin',{
      url:'/margin',
      templateUrl:'views/agency/margin.html',
      controller:'AgencyMarginController'
    })
    .state('app.agency.sales', {
      url: '/sales',
      templateUrl: 'views/agency/sales.html',
      controller: 'AgencySalesController'
    })
    .state('app.agency.history', {
      url: '/history',
      templateUrl: 'views/agency/history.html',
      controller: ''
    })
    .state('app.agency.other', {
      url: '/other',
      templateUrl: 'views/agency/other.html',
      controller: ''
    });
});