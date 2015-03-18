'use strict';

angular.module('origApp.controllers')
        .controller('HeaderController', function($scope, $rootScope, AuthService,HttpResource) {
          $scope.logout = function(){
            AuthService.doLogout();
          };
          $scope.currentUser = AuthService.getCurrentUser();
          HttpResource.model('constants/candidateStatus').query({},function (res) {
          	console.log('*****************************')
			     console.log(res);
			    });
        });