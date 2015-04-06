'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the origApp
 */
angular.module('origApp.controllers', [])
        .controller('MainController', function($timeout,$interval, $scope, $rootScope, $location, AuthService, userPermissions) {
          $rootScope.breadcrumbs = [{link:'/', text:'Home'}];
          $rootScope.currentUser = null;
          $rootScope.$watch('breadcrumbs', function () {
            $scope.hideBreadcrumbs = true;
            $timeout(function () {
              $scope.hideBreadcrumbs = false;
            },0);

          });

          
          if(AuthService.isLoggedIn()){
            $rootScope.currentUser = AuthService.getCurrentUser();
            // $rootScope.currentUser.userType = 'SA';
	          userPermissions.getUserPermission($rootScope.currentUser.userType).then(function(data){
	            console.log(data);            // if($location.path() === '/'){
	            console.log('******************************');

		          $scope.permissions = userPermissions.permissions.permissions.fields;
              console.log($scope.permissions);
	          });
          }
        });