'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp6Controller', function($scope, HttpResource, ConstantsResource, MsgService, ValidationHelper) {
          $scope.expenseData.transports = $scope.expenseData.transports || [];
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
          
          function addItem(data){
            $scope.expenseData.transports.push({
              date: data.date,
              type: data.type,
              cost: $scope.getCost(data.type, data.mileage)
            });
            $scope.addData = angular.copy($scope.defaultAddData);
          }

          $scope.add = function() {
            if($scope.addData.date==='all'){
              $scope.addAllDatesData($scope.addData, addItem);
            }else{
              addItem($scope.addData);
            }
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

