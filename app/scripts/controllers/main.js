'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the origApp
 */
angular.module('origApp.controllers', [])
        .controller('MainController', function($scope, $rootScope, AuthService, $state) {
          $rootScope.breadcrumbs = [{link:'/', text:'Home'}];
          $rootScope.currentUser = null;
          if(AuthService.isLoggedIn()){
            $rootScope.currentUser = AuthService.getCurrentUser();
          }
          
          $scope.isStateIncludes = function(pathKey){
            return $state.includes('app.' + pathKey);
          };
        });