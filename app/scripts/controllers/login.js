'use strict';

angular.module('origApp.controllers')
        .controller('LoginController', function($scope, AuthService, MsgService) {
          $scope.doLogin = function() {
            if ($scope.loginform.$validate()) {
              AuthService.doLogin($scope.email_address, $scope.password).then(
                      function() {
                      },
                      function(response) {
                        MsgService.alertByKey('danger', 'LoginError');
                      }
              );
            }
          };
        });