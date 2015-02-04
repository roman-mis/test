'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp6Controller', function($scope, HttpResource, ConstantsResource, MsgService, ValidationHelper) {
          $scope.expenseData.transports = [];
          $scope.transportTypes = ConstantsResource.get('transportationmeans');

          $scope.defaultAddData = {};
          $scope.addData = angular.copy($scope.defaultAddData);

          $scope.getCost = function(type, mileage) {
            var cost = type.default_ppm * mileage;
            if (type.code === '1' && mileage > 10000) { //ppm for Cars & Vans is [after 10,000 miles: 0.24ppm]
              cost = 0.24 * mileage;
            } else if (!$scope.isPpmDefined(type)) {
              cost = mileage;
            }
            return cost;
          };

          $scope.isPpmDefined = function(type) {
            if (!type) {
              return true;
            }
            return (type.default_ppm || 'N/A').toLowerCase() !== 'n/a';
          };

          $scope.add = function() {
            $scope.expenseData.transports.push({
              date: $scope.addData.date,
              type: $scope.addData.type,
              cost: $scope.getCost($scope.addData.type, $scope.addData.mileage)
            });
            $scope.addData = angular.copy($scope.defaultAddData);
          };

          $scope.remove = function(index) {
            $scope.expenseData.transports.splice(index, 1);
          };

          $scope.ok = function() {
            if($scope.isAllDatesEntered($scope.expenseData.transports)){
              $scope.gotoNext();
            }
          };

        });

