'use strict';
angular.module('origApp').config(function($stateProvider) {
  $stateProvider
    .state('register', {
      url: '/register',
      views: {
        header: {
          templateUrl: 'views/register/header.html',
          controller: ''
        },
        body: {
          templateUrl: 'views/register.html',
          controller: 'RegisterController'
        }
      }
    })
    .state('register.home', {
      url: '/home',
      templateUrl: 'views/register/home.html',
      controller: 'RegisterHomeController'
    })
    .state('register.step1', {
      url: '/step1',
      templateUrl: 'views/register/step1.html',
      controller: 'RegisterStep1Controller'
    })
    .state('register.step2', {
      url: '/step2',
      templateUrl: 'views/register/step2.html',
      controller: 'RegisterStep2Controller'
    })
    .state('register.step3', {
      url: '/step3',
      templateUrl: 'views/register/step3.html',
      controller: 'RegisterStep3Controller'
    })
    .state('register.step4', {
      url: '/step4',
      templateUrl: 'views/register/step4.html',
      controller: 'RegisterStep4Controller'
    })
    .state('register.step5', {
      url: '/step5',
      templateUrl: 'views/register/step5.html',
      controller: 'RegisterStep5Controller'
    })
    .state('register.confirm', {
      url: '/confirm',
      templateUrl: 'views/register/confirm.html',
      controller: 'RegisterConfirmController'
    })
    .state('register.welcome', {
      url: '/welcome',
      templateUrl: 'views/register/welcome.html',
      controller: 'RegisterWelcomeController'
    })
    .state('activateuser', {
      url: '/register/activate/:emailAddress/:activatecode',
      views: {
        header: {
          templateUrl: 'views/register/header.html',
          controller: ''
        },
        body: {
          templateUrl: 'views/register/activateuser.html',
          controller: 'RegisterActivateuserController'
        }
      }
    });
}); 