'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:RegisterHomeCtrl
 * @description
 * # RegisterHomeCtrl
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterActivateuserController', function($scope, $stateParams, HttpResource, $location) {
          $scope.emailAddress = $stateParams.emailAddress;
          $scope.activatecode = $stateParams.activatecode;
          HttpResource.model("users")
                  .customGet('activation/' + $scope.emailAddress, {verification_code: $scope.activatecode}, function(response) {
                    if (response.data.result === true) {
                    } else {
                      $location.path('/register/home')
                    }
                  }, function(response) {

                  });
                  
          $scope.submit = function() {
            if ($scope.activateform.$validate()) {
              HttpResource.model("users")
                      .customPost('activation/' + $scope.emailAddress, {
                        verification_code: $scope.activatecode,
                        new_password: $scope.password
                      })
                      .then(function(row) {
                        if (row.result === true) {
                          //*//
                          $location.path('/register/home')
                        }
                      }, function(response) {

                      });
            }
          };
        });
