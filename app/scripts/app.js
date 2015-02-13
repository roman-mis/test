'use strict';

/**
 * @ngdoc overview
 * @name origApp
 * @description
 * # origApp
 *
 * Main module of the application.
 */
angular.module('origApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'tastyResource',
  'ui.router',
  'ui.bootstrap',
  'ui.select',
  'cgNotify',
  'ngTagsInput',
  'angular-loading-bar',
  'origApp.controllers',
  'origApp.constants',
  'origApp.services',
  'origApp.directives',
  'origApp.filters',
  'ngTagsInput',
  'colorpicker.module',
  'wysiwyg.module' 
  //,
 // 'gm.datepickerMultiSelect'
])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  })
  .config(function(HttpResourceProvider) {
    HttpResourceProvider.setBaseUrl('/api/');
  })
  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 50;
  })
  .run(function($rootScope, $state, AuthService) {
    $rootScope.$watch(function() {
      return $state.current.name;
    }, function(newValue) {
      var stateName = newValue.split('.')[0];
      if (stateName === 'app') {
        if (AuthService.isLoggedIn() === false) {
          AuthService.redirectToLogin();
        }
      }
    });
    $rootScope.breadcrumbs = [];
  });