'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the origApp
 */
angular.module('origApp.controllers', [])
        .controller('MainController', function($interval, $scope, $rootScope, $location, AuthService, userPermissions) {
          $rootScope.breadcrumbs = [{link:'/', text:'Home'}];
          $rootScope.currentUser = null;
          if(AuthService.isLoggedIn()){
            $rootScope.currentUser = AuthService.getCurrentUser();
          }
          userPermissions.getUserPermission($rootScope.currentUser.userType).then(function(data){
            console.log(data);
            console.log(userPermissions);
            console.log(userPermissions.permissions);
          });
          $interval(function(){
            console.log(userPermissions.permissions);
          },1000);
            // $state.go('app.agencies');
        });