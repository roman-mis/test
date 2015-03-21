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
	          userPermissions.getUserPermission(AuthService.getCurrentUser().userType).then(function(data){
	            console.log(data);            // if($location.path() === '/'){
	            console.log('******************************');
	            // }
		          console.log(userPermissions.permissions.permissions.fields.candidate.taps);
		          $scope.permissions = userPermissions.permissions.permissions.fields.candidate;
	          });
          }
        });