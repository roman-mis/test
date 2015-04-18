'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp6Controller', function ($scope, HttpResource, ConstantsResource, MsgService, ValidationHelper, $modal) {
            $scope.expenseData.transports = $scope.expenseData.transports || [];
            $scope.transportTypes = ConstantsResource.get('transportationmeans');
            $scope.fuelTypes = ConstantsResource.get('fuels');
            $scope.engineSizes = [];
            var vehicleInfoEntered = false;
            $scope.expenseData.postCodes = $scope.expenseData.postCodes || [];
            $scope.codeHolder = [];
            $scope.receiptUrlArray = [];

            $scope.vehicle = $scope.expenseData.vehicleInfo || {};
            $scope.defaultAddData = {};
            $scope.addData = angular.copy($scope.defaultAddData);
            $scope.whichShow = 'main';

            $scope.getCost = function (type, mileage) {
                var cost = type.default_ppm * mileage;
                if (type.code === '1' && mileage > 10000) { //ppm for Cars & Vans is [after 10,000 miles: 0.24ppm]
                    cost = 0.24 * mileage;
                } else if (!$scope.isPpmDefined(type)) {
                    cost = mileage;
                }
                return cost;
            };

            $scope.getValue = function (type, mileage) {
                var value = type.default_ppm;
                if (type.code === '1' && mileage > 10000) { //ppm for Cars & Vans is [after 10,000 miles: 0.24ppm]
                    value = 0.24;
                } else if (!$scope.isPpmDefined(type)) {
                    value = 1;
                }
                return value;
            };

            $scope.isPpmDefined = function (type) {
                if (!type) {
                    return true;
                }
                return (type.default_ppm || 'N/A').toLowerCase() !== 'n/a';
            };

            function addItem(data) {
                $scope.expenseData.transports.push({
                    date: data.date,
                    type: data.type,
                    cost: $scope.getCost(data.type, data.mileage),
                    mileage: data.mileage,
                    value: $scope.getValue(data.type, data.mileage),
                    amount: data.mileage
                });
                $scope.addData = angular.copy($scope.defaultAddData);
            }
            function addItemManual(data) {
                $scope.expenseData.transports.push({
                    date: data.date,
                    type: data.type,
                    cost: $scope.getCost(data.type, data.mileage),
                    mileage: data.mileage,
                    value: $scope.getValue(data.type, data.mileage),
                    amount: data.mileage
                });
                $scope.receiptUrlArray.push([]);
                $scope.expenseData.postCodes.push({
                    date: data.date,
                    codes: data.codes
                });

                $scope.codeHolder.push(data.codes);
                $scope.addData = angular.copy($scope.defaultAddData);
            }

            $scope.add = function () {
                if ($scope.addData.date === 'all') {
                    $scope.addAllDatesData($scope.addData, addItem);
                } else {
                    addItem($scope.addData);
                }
            };

            $scope.addManual = function () {
                var codes = $scope.addData.code.split(/,/g).map(function (item) {
                    return $.trim(item);
                });
                codes = $.unique(codes.filter(function (item) {
                    return item !== '';
                }));
                if (codes.length === 0) {
                    MsgService.danger('There are no valid postcodes that have been entered.');
                    return;
                }
                var invalidCodes = [];
                codes.forEach(function (val) {
                    if (!ValidationHelper.isValidPostCode(val)) {
                        invalidCodes.push(val);
                    }
                });
                if (invalidCodes.length > 0) {
                    MsgService.danger('Invalid postcode: ' + invalidCodes.join(', '));
                    return;
                }

                $scope.addData.codes = codes;

                if ($scope.addData.date === 'all') {
                    $scope.addAllDatesData($scope.addData, addItemManual);
                } else {
                    addItemManual($scope.addData);
                }
            };

            $scope.remove = function (index) {
                $scope.expenseData.transports.splice(index, 1);
            };

            $scope.removeManual = function (index) {
                $scope.expenseData.transports.splice(index, 1);
                $scope.expenseData.postCodes.splice(index, 1);
                $scope.receiptUrlArray.splice(index, 1);
                $scope.codeHolder.splice(index, 1);
            };

            $scope.onChangeFuelType = function () {
                var filtered = $scope.fuelTypes.filter(function (item) {
                    return item.code === $scope.vehicle.fuelType;
                });
                if (filtered.length > 0) {
                    $scope.engineSizes = filtered[0].engineSizes;
                } else {
                    $scope.engineSizes = [];
                }
            };

            $scope.ok = function () {
                //if ($scope.isAllDatesEntered($scope.expenseData.transports)) {
                var carvanItems = $scope.expenseData.transports.filter(function (item) {
                    return item.type.code === $scope.mainData.carvanTransportType;
                });
                if (carvanItems.length === 0) {
                    $scope.gotoNext();
                } else {
                    //check if ever created expenses
                    $scope.isVehicleChecking = true;
                    var object = HttpResource.model('candidates/' + $scope.mainData.candidateId + '/vehicleinformation').get($scope.mainData.carvanTransportType, function () {
                        $scope.isVehicleChecking = false;
                        if (object && object.vehicleInformaiton && object.vehicleInformaiton.vehicleCode) {
                            $scope.gotoNext();
                        } else {
                            $scope.showVehicleForm();
                        }
                    });
                }
                //}
            };

            $scope.okManual = function () {
                //if ($scope.isAllDatesEntered($scope.expenseData.transports)) {
                var carvanItems = $scope.expenseData.transports.filter(function (item) {
                    return item.type.code === $scope.mainData.carvanTransportType;
                });
                if (carvanItems.length === 0) {

                } else {
                    //check if ever created expenses
                    $scope.isVehicleChecking = true;
                    var object = HttpResource.model('candidates/' + $scope.mainData.candidateId + '/vehicleinformation').get($scope.mainData.carvanTransportType, function () {
                        $scope.isVehicleChecking = false;
                        if ((object && object.vehicleInformaiton && object.vehicleInformaiton.vehicleCode) || vehicleInfoEntered) {

                        } else {
                            $scope.showVehicleForm();
                        }
                    });
                }
                //}
            };


            $scope.showVehicleForm = function () {
                $scope.whichShow = 'vehicle';
            };

            $scope.saveVehicleForm = function () {
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

            $scope.saveVehicleFormManual = function () {
                $scope.expenseData.vehicleInfo = angular.copy($scope.vehicle);
                $scope.expenseData.vehicleInfo.vehicleCode = $scope.mainData.carvanTransportType;
                $scope.whichShow = 'main';
                vehicleInfoEntered = true;
            };

            $scope.cancelVehicleForm = function () {
                $scope.vehicle = $scope.expenseData.vehicleInfo || {};
                $scope.whichShow = 'main';
            };

            $scope.$watch('expenseData.transports.length', function () {
                setTimeout(function () {
                    $scope.normalizeTables();
                });
            });

            $scope.viewReceipt = function (index) {
                //logs(expense.receiptUrls, 'URLs');
                var modalInstance = $modal.open({
                    templateUrl: 'views/candidate/expenseReceipt.html',
                    controller: 'expenseReceiptManualCtrl',
                    size: 'md',
                    resolve: {
                        rootScope: function () {
                            return $scope;
                        },
                        index: function () {
                            return index;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    saveAnyway();
                }, function (msg) {
                    saveAnyway();
                });
                function saveAnyway() {
                    $scope.expenseData.transports[index].receiptUrls = $scope.receiptUrlArray[index];
                }
            }

        });

