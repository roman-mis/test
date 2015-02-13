'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp6Controller', function($scope, HttpResource, ConstantsResource, MsgService, ValidationHelper) {
          $scope.expenseData.transports = $scope.expenseData.transports || [];
          $scope.transportTypes = ConstantsResource.get('transportationmeans');
          $scope.fuelTypes = ConstantsResource.get('fuels');
          $scope.engineSizes = [];

          $scope.vehicle = $scope.expenseData.vehicleInfo || {};
          $scope.defaultAddData = {};
          $scope.addData = angular.copy($scope.defaultAddData);
          $scope.whichShow = 'main';

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

          function addItem(data) {
            $scope.expenseData.transports.push({
              date: data.date,
              type: data.type,
              cost: $scope.getCost(data.type, data.mileage)
            });
            $scope.addData = angular.copy($scope.defaultAddData);
          }

          $scope.add = function() {
            if ($scope.addData.date === 'all') {
              $scope.addAllDatesData($scope.addData, addItem);
            } else {
              addItem($scope.addData);
            }
          };

          $scope.remove = function(index) {
            $scope.expenseData.transports.splice(index, 1);
          };

          $scope.onChangeFuelType = function() {
            var filtered = $scope.fuelTypes.filter(function(item) {
              return item.code === $scope.vehicle.fuelType;
            });
            if (filtered.length > 0) {
              $scope.engineSizes = filtered[0].engineSizes;
            } else {
              $scope.engineSizes = [];
            }
          };

          $scope.ok = function() {
            if ($scope.isAllDatesEntered($scope.expenseData.transports)) {
              var carvanItems = $scope.expenseData.transports.filter(function(item) {
                return item.type.code === $scope.mainData.carvanTransportType;
              });
              if (carvanItems.length === 0) {
                $scope.gotoNext();
              } else {
                //check if ever created expenses
                $scope.isVehicleChecking = true;
                var object = HttpResource.model('candidates/' + $scope.mainData.candidateId + '/vehicleinformation').get($scope.mainData.carvanTransportType, function() {
                  $scope.isVehicleChecking = false;
                  if(object && object.vehicleInformaiton && object.vehicleInformaiton.vehicleCode){
                    $scope.gotoNext();
                  }else{                  
                    $scope.showVehicleForm();
                  }
                });
              }
            }
          };


          $scope.showVehicleForm = function() {
            $scope.whichShow = 'vehicle';
          };

          $scope.saveVehicleForm = function() {
            $scope.expenseData.vehicleInfo = angular.copy($scope.vehicle);
            $scope.expenseData.vehicleInfo.vehicleCode = $scope.mainData.carvanTransportType;
            $scope.gotoNext();
            /*$scope.isVehicleSaving = true;
             HttpResource.model('candidates/' + $scope.mainData.candidateId)
             .create($scope.vehicle)
             .patch('vehicleinformation')
             .then(function(response) {
             $scope.isVehicleSaving = false;
             if (!HttpResource.flushError(response)) {
             $scope.gotoNext();
             }
             });*/
          };

          $scope.cancelVehicleForm = function() {
            $scope.vehicle = $scope.expenseData.vehicleInfo || {};
            $scope.whichShow = 'main';
          };

          $scope.$watch('expenseData.transports.length', function() {
            setTimeout(function() {
              $scope.normalizeTables();
            });
          });


        });

