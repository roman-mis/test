'use strict';
angular.module('origApp').config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '',
      abstract: true,
      views: {
        header: {
          templateUrl: 'views/partials/header.html',
          controller: 'HeaderController'
        },
        body: {
          templateUrl: 'views/main.html',
          controller: 'MainController'
        }
      },
      resolve: {permissions:['userPermissions', 'AuthService' ,function(userPermissions,AuthService){
        console.log(AuthService.getCurrentUser());

        
        }]}
    })

  .state('app.first', {
    url: '/',
    controller: 'first'
  })
  
  .state('reset-password', {
    url: '/reset-password/:emailAddress/:verifyCode',
    views: {
      header: {
        templateUrl: 'views/register/header.html',
        controller: ''
      },
      body: {
        templateUrl: 'views/reset_password.html',
        controller: 'ResetPasswordController'
      }
    }
  });

  $urlRouterProvider.otherwise('/');
});