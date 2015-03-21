'use strict';

angular.module('origApp.controllers')
        .controller('LoginController', function($scope, AuthService, MsgService) {
          $scope.doLogin = function() {
            if ($scope.loginform.$validate()) {
              AuthService.doLogin($scope.emailAddress, $scope.password).then(
                function() {
                },
                function() {
                  MsgService.alertByKey('danger', 'LoginError');
                }
              );
            }
          };
        });