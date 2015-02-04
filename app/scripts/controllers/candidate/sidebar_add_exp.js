'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExpController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, params) {

          $scope.mainData = {step: 3};

          $scope.expenseData = {};

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };

          $scope.gotoNext = function() {
            $scope.mainData.step++;
          };

          $scope.gotoPrevious = function() {
            $scope.mainData.step--;
          };

        });

