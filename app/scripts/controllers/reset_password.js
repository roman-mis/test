'use strict';

angular.module('origApp.controllers')
        .controller('ResetPasswordController', function($scope, $stateParams, HttpResource, $location, MsgService) {
          console.log('0000055555')
          $scope.emailAddress = $stateParams.emailAddress;
          $scope.verifyCode = $stateParams.verifyCode;
          $scope.isValidCode = true;
          
          HttpResource.model('users')
                  .customGet('changepassword/verify/' + $scope.emailAddress + '/' + $scope.verifyCode, {}, function(response) {
                    if (response.data.result === true) {
                      $scope.isValidCode = true;
                    } else {
                      console.log(11110)
                      HttpResource.model('users')
                        .customGet('resetpassword/verify/' + $scope.emailAddress + '/' + $scope.verifyCode, {}, function(response) {
                          if (response.data.result === true) {
                            $scope.isValidCode = true;
                      console.log(2222222222222222)

                          } else {
                            $scope.isValidCode = false;
                            //MsgService.danger(response.data.message);
                      console.log(3333333333333)

                          }
                        }, function() {

                        });
                      //MsgService.danger(response.data.message);
                    }
                  }, function() {

                  });

          $scope.submit = function() {
            if ($scope.pwdform.$validate()) {
              HttpResource.model('users')
                      .customPost('changepassword/' + $scope.emailAddress + '/' + $scope.verifyCode, {
                        newPassword: $scope.password
                      })
                      .then(function(response) {
                        if (!HttpResource.flushError(response)) {
                          MsgService.success('Password has been changed successfully.');
                          $location.path('/');
                        }
                      }, function() {

                      });
            }
          };
        });
