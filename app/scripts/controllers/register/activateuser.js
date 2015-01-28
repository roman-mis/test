'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:RegisterHomeCtrl
 * @description
 * # RegisterHomeCtrl
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterActivateuserController', function($scope, $stateParams, HttpResource, $location, MsgService) {
          $scope.emailAddress = $stateParams.emailAddress;
          $scope.activatecode = $stateParams.activatecode;
          HttpResource.model("users")
                  .customGet('activation/' + $scope.emailAddress, {verificationCode: $scope.activatecode}, function(response) {
                    if (response.data.result) {
                    } else {
                      alert(response.data.message);
                      $location.path('/register/home');
                    }
                  }, function(response) {

                  });
                  
          $scope.submit = function() {
            if ($scope.activateform.$validate()) {
              HttpResource.model("users")
                      .customPost('activation/' + $scope.emailAddress, {
                        verificationCode: $scope.activatecode,
                        newPassword: $scope.password
                      })
                      .then(function(response) {
                        if (response.data.result) {
                          //*//
                          MsgService.success('New password has been set successfully. Please login with your new password.');
                          $location.path('/register/home')
                        }
                      }, function(response) {

                      });
            }
          };
        });
