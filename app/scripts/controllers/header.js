'use strict';

angular.module('origApp.controllers')
        .controller('HeaderController', function($scope, $rootScope, AuthService) {
          $scope.logout = function(){
            AuthService.doLogout();
          }
        });