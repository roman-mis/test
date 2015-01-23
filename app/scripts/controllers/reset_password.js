'use strict';

angular.module('origApp.controllers')
        .controller('ResetPasswordController', function($scope, $stateParams, HttpResource, $location, MsgService) {
          $scope.emailAddress = $stateParams.emailAddress;
          $scope.verifyCode = $stateParams.verifyCode;
          $scope.isValidCode = true;
          HttpResource.model("users")
                  .customGet('changepassword/verify/' + $scope.emailAddress + '/' + $scope.verifyCode, {}, function(response) {
                    if (response.data.result === true) {
                      $scope.isValidCode = true;
                    } else {
                      $scope.isValidCode = false;
                      //MsgService.danger(response.data.message);
                    }
                  }, function(response) {

                  });

          $scope.submit = function() {
            if ($scope.pwdform.$validate()) {
              HttpResource.model("users")
                      .customPost('changepassword/' + $scope.emailAddress + '/' + $scope.verifyCode, {
                        new_password: $scope.password
                      })
                      .then(function(response) {
                        if (!HttpResource.flushError(response)) {
                          MsgService.success('Password has been changed successfully.');
                          $location.path('/');
                        }
                      }, function(response) {

                      });
            }
          };
        });
