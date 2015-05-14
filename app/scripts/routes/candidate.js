'use strict';
angular.module('origApp').config(function($stateProvider) {
  $stateProvider
    .state('app.candidates', {
      url: '/candidates',
      templateUrl: 'views/candidate/list.html',
      controller: 'CandidateListController'
    })
    .state('app.candidate', {
      url: '/candidates/:candidateId',
      abstract: true,
      templateUrl: 'views/candidate/main.html',
      controller: 'CandidateMainController'
    })
    .state('app.candidate.home', {
      url: '',
      templateUrl: 'views/candidate/home.html',
      controller: 'CandidateHomeController'
    })
    .state('app.candidate.contact', {
      url: '/contact',
      templateUrl: 'views/candidate/contact.html',
      controller: 'CandidateContactController'
    })
    .state('app.candidate.payroll', {
      url: '/payroll',
      templateUrl: 'views/candidate/payroll.html',
      controller: 'CandidatePayrollController'
    })
    .state('app.candidate.margin', {
      url: '/margin',
      templateUrl: 'views/candidate/margin.html',
      controller: 'candidateMarginController'
    })
    .state('app.candidate.payslips', {
      url: '/payslips',
      templateUrl: 'views/candidate/payslip.html',
      controller: 'CandidatePayslipsController'
    })
    .state('app.candidate.agencies', {
      url: '/agencies',
      templateUrl: 'views/candidate/agencies.html',
      controller: 'CandidateAgenciesController'
    })
    .state('app.candidate.compliance', {
      url: '/compliance',
      templateUrl: 'views/candidate/compliance.html',
      controller: 'CandidateCompilanceController'
    })
    .state('app.candidate.history', {
      url: '/history',
      templateUrl: 'views/candidate/history.html',
      controller: 'CandidateHistoryController'
    });
}); 