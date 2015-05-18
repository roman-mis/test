'use strict';
var app = angular.module('origApp.controllers');

app.controller("expensesAuthorizationCtrl",
    ['$scope', '$http', '$rootScope', 'HttpResource', 'ConstantsResource', '$modal', 'Notification', '$q',
        function ($scope, $http, $rootScope, HttpResource, ConstantsResource, $modal, Notification, $q) {

            $rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
                { link: '/activity/home', text: 'Activity' },
                { link: '/activity/expensesAuthorization', text: 'Expenses Authorisation' }
            ];
            var valuesForTransport = [];
            var deferred = [];
            var promiseArray = [];
            for (var i = 0; i <= 5; i++) {
                deferred.push($q.defer());
                promiseArray.push(deferred[i].promise);
            }
            $scope.options = {
                currentPage: 1,
                limit: 20
            };
            $scope.loadExpenses = function () {
                var params = {};
                if ($scope.options.limit) {
                    params._limit = $scope.options.limit;
                }
                if ($scope.options.currentPage) {
                    params._offset = ($scope.options.currentPage - 1) * $scope.options.limit;
                } else {
                    params._offset = 0;
                }
                // if ($scope.filterFirstName) {
                //      params.firstName_contains= $scope.filterFirstName;
                //  }
                HttpResource.model('candidates/expenses').query(params, function (expenses) {
                    logs('getting expenses done !!');
                    logs(expenses.data.object, 'everything');
                    $scope.system = expenses.data.object.system[0];
                    logs($scope.system, 'system doc');
                    $scope.expensesArray = expenses.data.object.claims;
                    $scope.options.totalItems = expenses.data.object.totalCount;
                    logs($scope.options, 'options');
                    $scope.system.statutoryTables.vat.forEach(function (time) {
                        var validFrom = new Date(time.validFrom);
                        var validTo = new Date(time.validTo);
                        var current = new Date();
                        if (current.valueOf() >= validFrom.valueOf() && current.valueOf() <= validTo.valueOf()) {
                            $scope.globalVat = time.amount / 100;
                            logs($scope.globalVat, 'global vat');
                        }
                    });
                    init();
                });



            };

            $q.all([promiseArray[0], promiseArray[1], promiseArray[2], promiseArray[3], promiseArray[4]]).then(function () {
                logs('it works');
                $scope.loadExpenses();
            });

            $http.get('api/constants/transportationmeans').success(function (res) {
                logs(res, 'transports');
                valuesForTransport[0] = res[0].default_ppm;
                valuesForTransport[1] = res[1].default_ppm;
                valuesForTransport[2] = res[2].default_ppm;
                $scope.transportTypes = res;
                deferred[0].resolve();
            });
            $scope.mealTypes = HttpResource.model('systems/expensesrates/expensesratetype/subsistence').query({}, function () {
                deferred[1].resolve();
            });

            //promiseArray[0].then(function () {
            //    logs('************0************');
            //});
            //promiseArray[1].then(function () {
            //    logs('************1************');
            //});
            //promiseArray[2].then(function () {
            //    logs('************2************');
            //});
            //promiseArray[3].then(function () {
            //    logs('************3************');
            //});
            //promiseArray[4].then(function () {
            //    logs('************4************');
            //});


            $http.get('/api/constants/expenseClaimStatus').success(function (res) {
                $scope.expenseStatus = res;
                deferred[2].resolve();
            });
            //$http.get('/api/constants/expenseStatus').success(function (res) {
            //    $scope.expenseStatus = res;
            //});
            $scope.otherTypes = HttpResource.model('systems/expensesrates/expensesratetype/other').query({}, function () {
                deferred[3].resolve();
            });

            $http.get('/api/constants/fuels').success(function (res) {
                logs(res, 'fuels');
                $scope.fuels = res;
                deferred[4].resolve();
            });
            //$http.get('/api/constants/enginesizes').success(function (res) {
            //    logs(res, 'engine sizes')
            //});

            $scope.pendingRejections = [];

            //function getVehicleInfo(userId, code) {
            //    $http.get('/api/candidates/' + userId + '/vehicleinformation/' + code).success(function (res) {
            //        logs(res, 'vehicle info')
            //    });
            //}

            function init() {
                for (var i = 0; i < $scope.expensesArray.length; i++) {
                    //if (i == 0) {
                    //    logs($scope.expensesArray[i].user._id, 'user id');
                    //    logs($scope.expensesArray[i].user.worker.vehicleInformation[0]._id, 'vehicle code');
                    //    getVehicleInfo($scope.expensesArray[i].user._id, $scope.expensesArray[i].user.worker.vehicleInformation[0]._id);
                    //}

                    $scope.expensesArray[i].startDate = getMonday($scope.expensesArray[i].claimDate);
                    $scope.expensesArray[i].categories = [];
                    $scope.expensesArray[i].majorChecked = false;
                    $scope.expensesArray[i].total = 0;
                    for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                        $scope.expensesArray[i].expenses[j].checked = false;
                        $scope.expensesArray[i].expenses[j].edit = false;

                        $scope.expensesArray[i].expenses[j].date = new Date($scope.expensesArray[i].expenses[j].date);
                        $scope.expensesArray[i].expenses[j].date.setHours(0, 0, 0, 0);
                        $scope.expensesArray[i].expenses[j].date = $scope.expensesArray[i].expenses[j].date.toISOString();
                        $scope.expensesArray[i].expenses[j].validDates = getWeek($scope.expensesArray[i].expenses[j].date);

                        // initializing vat
                        $scope.expensesArray[i].expenses[j].expenseDetail.vat = 0;
                        // calculating vat for Subsistence and Other
                        $scope.system.expensesRate.forEach(function (doc) {
                            if ($scope.expensesArray[i].expenses[j].expenseDetail.id == doc._id) {
                                if (doc.taxApplicable) {
                                    $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                    $scope.expensesArray[i].expenses[j].value * $scope.globalVat;
                                } else {
                                    $scope.expensesArray[i].expenses[j].expenseDetail.vat = 0;
                                }
                            }
                        });

                        // calculating vat for Transport
                        if ($scope.expensesArray[i].expenses[j].expenseType == 'Transport'
                            && $scope.expensesArray[i].expenses[j].subType == 'Car / Van') {
                            var fuelType = $scope.expensesArray[i].user.worker.vehicleInformation[0].fuelType;
                            var engineSize = $scope.expensesArray[i].user.worker.vehicleInformation[0].engineSize;
                            var piece = {
                                fuelCode: fuelType,
                                engineCode: engineSize
                            };
                            $scope.fuels.forEach(function (item) {
                                if (fuelType == item.code) {
                                    piece.fuelType = item.description;
                                    item.engineSizes.forEach(function (minor) {
                                        if (engineSize == minor.code) {
                                            piece.engineSize = minor.description;
                                        }
                                    });
                                }
                            });
                            //logs(piece, 'Piece');
                            if (piece.fuelCode == '1') {
                                switch (piece.engineCode) {
                                    case '1':
                                        $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                        $scope.system.mileageRates.petrolUpTo1400 * $scope.globalVat;
                                        break;
                                    case '2':
                                        $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                        $scope.system.mileageRates.petrol1401to2000 * $scope.globalVat;
                                        break;
                                    case '3':
                                        $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                        $scope.system.mileageRates.petrol1401to2000 * $scope.globalVat;
                                        break;
                                }

                            } else if (piece.fuelCode == '2') {
                                switch (piece.engineCode) {
                                    case '1':
                                        $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                        $scope.system.mileageRates.dieselUpTo1600 * $scope.globalVat;
                                        break;
                                    case '2':
                                        $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                        $scope.system.mileageRates.diesel1601to2000 * $scope.globalVat;
                                        break;
                                    case '3':
                                        $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                        $scope.system.mileageRates.dieselAbove2001 * $scope.globalVat;
                                        break;
                                }
                            } else if (piece.fuelCode == '3' && piece.engineCode == '1') {
                                switch (piece.engineCode) {
                                    case '1':
                                        $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                        $scope.system.mileageRates.lpgUpTo1400 * $scope.globalVat;
                                        break;
                                    case '2':
                                        $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                        $scope.system.mileageRates.lpg1401to2000 * $scope.globalVat;
                                        break;
                                    case '3':
                                        $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                        $scope.system.mileageRates.lpgAbove2001 * $scope.globalVat;
                                        break;
                                }
                            }
                        }

                        // calculating total based on vat, amount and value
                        $scope.expensesArray[i].expenses[j].expenseDetail.total = 0;
                        $scope.expensesArray[i].expenses[j].expenseDetail.total +=
                        $scope.expensesArray[i].expenses[j].amount * $scope.expensesArray[i].expenses[j].value ? $scope.expensesArray[i].expenses[j].amount * $scope.expensesArray[i].expenses[j].value : 0;
                        $scope.expensesArray[i].expenses[j].expenseDetail.total +=
                        $scope.expensesArray[i].expenses[j].amount * $scope.expensesArray[i].expenses[j].expenseDetail.vat ? $scope.expensesArray[i].expenses[j].amount * $scope.expensesArray[i].expenses[j].expenseDetail.vat : 0;
                        $scope.expensesArray[i].total += $scope.expensesArray[i].expenses[j].expenseDetail.total;

                        if ($scope.expensesArray[i].categories.indexOf($scope.expensesArray[i].expenses[j].expenseType) == -1) {
                            $scope.expensesArray[i].categories.push($scope.expensesArray[i].expenses[j].expenseType);
                        }
                    }
                }
                $scope.cloned = [];
                angular.copy($scope.expensesArray, $scope.cloned);
                logs($scope.expensesArray, 'Expenses Array');
            }

            function getMonday(d) {
                d = new Date(d);
                var day = d.getDay(),
                    diff = d.getDate() - day + (day == 0 ? -6 : 1);
                return new Date(d.setDate(diff));
            }

            function getWeek(anyDay) {
                var start = getMonday(anyDay);
                var days = [];
                days.push(start.toISOString());
                for (var i = 1; i < 7; i++) {
                    var temp = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                    var date = new Date(temp.setDate(start.getDate() + i));
                    date.setHours(0, 0, 0, 0);
                    days.push(date.toISOString());
                }
                return days;
            }

            $scope.finishEditing = function (expenseIndex, itemId, save) {
                //logs(expenseIndex, itemId);
                if (save) {
                    var req = {};
                    req.body = [];
                    for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                        if ($scope.expensesArray[expenseIndex].expenses[i]._id === itemId) {
                            var newStatus = $scope.cloned[expenseIndex].expenses[i].status;
                            if ($scope.expensesArray[expenseIndex].expenses[i].status != $scope.cloned[expenseIndex].expenses[i].status
                                && $scope.cloned[expenseIndex].expenses[i].status == 'rejected') {
                                newStatus = $scope.expensesArray[expenseIndex].expenses[i].status;
                                if ($scope.pendingRejections.indexOf($scope.expensesArray[expenseIndex].expenses[i]) == -1) {
                                    var origStatus = $scope.expensesArray[expenseIndex].expenses[i].status;
                                    $scope.pendingRejections.push($scope.expensesArray[expenseIndex].expenses[i]);
                                }
                                Notification.primary('Marked for Rejection');
                            }

                            if ($scope.expensesArray[expenseIndex].expenses[i].status != $scope.cloned[expenseIndex].expenses[i].status
                                && $scope.expensesArray[expenseIndex].expenses[i].status == 'rejected'
                                && $scope.pendingRejections.indexOf($scope.expensesArray[expenseIndex].expenses[i]) != -1) {
                                $scope.pendingRejections.splice(
                                    $scope.pendingRejections.indexOf($scope.expensesArray[expenseIndex].expenses[i]), 1);
                            }

                            var subType = '';
                            if ($scope.cloned[expenseIndex].expenses[i].expenseType == 'Subsistence') {
                                for (var j = 0; j < $scope.mealTypes.length; j++) {
                                    var newSub = $scope.cloned[expenseIndex].expenses[i].expenseDetail.name;
                                    if (newSub == $scope.mealTypes[j].name) {
                                        subType = $scope.mealTypes[j]._id;
                                        $scope.cloned[expenseIndex].expenses[i].expenseDetail.id = subType;
                                        break;
                                    }
                                }
                            } else if ($scope.cloned[expenseIndex].expenses[i].expenseType == 'Other') {
                                for (var j = 0; j < $scope.otherTypes.length; j++) {
                                    var newSub = $scope.cloned[expenseIndex].expenses[i].expenseDetail.name;
                                    if (newSub == $scope.otherTypes[j].name) {
                                        subType = $scope.otherTypes[j]._id;
                                        $scope.cloned[expenseIndex].expenses[i].expenseDetail.id = subType;
                                        break;
                                    }
                                }
                            } else {
                                subType = $scope.cloned[expenseIndex].expenses[i].expenseDetail.name;
                            }

                            $scope.cloned[expenseIndex].expenses[i].expenseDetail.vat = 0; // resetting for all types
                            // recalculating vat for Subsistence and Other
                            $scope.system.expensesRate.forEach(function (doc) {
                                if ($scope.cloned[expenseIndex].expenses[i].expenseDetail.id == doc._id) {
                                    if (doc.taxApplicable) {
                                        //logs('doing right');
                                        $scope.cloned[expenseIndex].expenses[i].expenseDetail.vat =
                                        $scope.cloned[expenseIndex].expenses[i].value * $scope.globalVat;
                                    }
                                }
                            });

                            // recalculating vat and value for trasport
                            if ($scope.cloned[expenseIndex].expenses[i].expenseType == 'Transport') {
                                $scope.cloned[expenseIndex].expenses[i].value = 0;
                                if ($scope.cloned[expenseIndex].expenses[i].expenseDetail.name == 'Car / Van') {
                                    $scope.cloned[expenseIndex].expenses[i].value = valuesForTransport[0];
                                    var fuelType = $scope.cloned[expenseIndex].user.worker.vehicleInformation[0].fuelType;
                                    var engineSize = $scope.cloned[expenseIndex].user.worker.vehicleInformation[0].engineSize;
                                    var piece = {
                                        fuelCode: fuelType,
                                        engineCode: engineSize
                                    };
                                    $scope.fuels.forEach(function (item) {
                                        if (fuelType == item.code) {
                                            piece.fuelType = item.description;
                                            item.engineSizes.forEach(function (minor) {
                                                if (engineSize == minor.code) {
                                                    piece.engineSize = minor.description;
                                                }
                                            });
                                        }
                                    });
                                    if (piece.fuelCode == '1' && piece.engineCode == '1') {
                                        $scope.cloned[expenseIndex].expenses[i].expenseDetail.vat =
                                        $scope.system.mileageRates.petrolUpTo1400 * $scope.globalVat;
                                    } else if (piece.fuelCode == '2' && piece.engineCode == '1') {
                                        $scope.cloned[expenseIndex].expenses[i].expenseDetail.vat =
                                        $scope.system.mileageRates.dieselUpTo1600 * $scope.globalVat;
                                    } else if (piece.fuelCode == '3' && piece.engineCode == '1') {
                                        $scope.cloned[expenseIndex].expenses[i].expenseDetail.vat =
                                        $scope.system.mileageRates.lpgUpTo1400 * $scope.globalVat;
                                    }
                                } else if ($scope.cloned[expenseIndex].expenses[i].expenseDetail.name == 'Motorbike') {
                                    $scope.cloned[expenseIndex].expenses[i].value = valuesForTransport[1];
                                } else if ($scope.cloned[expenseIndex].expenses[i].expenseDetail.name == 'Bicycle') {
                                    $scope.cloned[expenseIndex].expenses[i].value = valuesForTransport[2];
                                }
                            }

                            //logs($scope.cloned[expenseIndex].expenses[i].expenseDetail.vat, 'cloned');
                            //logs($scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat, 'original');
                            //logs($scope.cloned[expenseIndex].expenses[i], 'check this one');
                            
                            if (!$scope.cloned[expenseIndex].expenses[i].amount) {
                                $scope.cloned[expenseIndex].expenses[i].amount = $scope.expensesArray[expenseIndex].expenses[i].amount;
                                Notification.warning('Invalid amount input');
                            }
                            
                            if (!$scope.cloned[expenseIndex].expenses[i].value && $scope.cloned[expenseIndex].expenses[i].expenseType !== 'Transport') {
                                $scope.cloned[expenseIndex].expenses[i].value = $scope.expensesArray[expenseIndex].expenses[i].value;
                                Notification.warning('Invalid value input');
                            }
                            
                            angular.copy($scope.cloned[expenseIndex].expenses[i], $scope.expensesArray[expenseIndex].expenses[i]);
                            if (origStatus) {
                                $scope.expensesArray[expenseIndex].expenses[i].origStatus = origStatus;
                            }

                            //logs($scope.expensesArray[expenseIndex].expenses[i].date);
                            req.body.push({
                                expenseType: $scope.expensesArray[expenseIndex].expenses[i].expenseType,
                                subType: subType,
                                date: $scope.expensesArray[expenseIndex].expenses[i].date,
                                amount: $scope.expensesArray[expenseIndex].expenses[i].amount,
                                value: $scope.expensesArray[expenseIndex].expenses[i].value,
                                vat: $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat,
                                total: $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.total,
                                id: $scope.expensesArray[expenseIndex].expenses[i]._id,
                                claimId: $scope.expensesArray[expenseIndex].id,
                                receiptUrls: $scope.expensesArray[expenseIndex].expenses[i].receiptUrls,
                                status: newStatus
                            });
                            //logs(req.body);
                            break;
                        }
                    }
                    //logs(req, 'manual edit request');
                    $http.put('/api/candidates/expenses/edit', req).success(function (res) {
                        logs(res, 'Edit Response');
                        $scope.expensesArray[expenseIndex].total = 0;
                        for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                            //$scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat = 0; // resetting for all types
                            //// recalculating vat for Subsistence and Other
                            //$scope.system.expensesRate.forEach(function (doc) {
                            //    if ($scope.expensesArray[expenseIndex].expenses[i].expenseDetail.id == doc._id) {
                            //        if (doc.taxApplicable) {
                            //            $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat =
                            //                $scope.expensesArray[expenseIndex].expenses[i].value * $scope.globalVat;
                            //        }
                            //    }
                            //});

                            // recalculating vat for Transport
                            //if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == 'Transport') {
                            //    //logs('is transport');
                            //    $scope.expensesArray[expenseIndex].expenses[i].value = 0;
                            //    $scope.cloned[expenseIndex].expenses[i].value = 0;
                            //    if ($scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name == 'Car / Van') {
                            //        //logs('is carvan');
                            //        $scope.expensesArray[expenseIndex].expenses[i].value = valuesForTransport[0];
                            //        $scope.cloned[expenseIndex].expenses[i].value = valuesForTransport[0];
                            //        var fuelType = $scope.expensesArray[expenseIndex].user.worker.vehicleInformation[0].fuelType;
                            //        var engineSize = $scope.expensesArray[expenseIndex].user.worker.vehicleInformation[0].engineSize;
                            //        var piece = {
                            //            fuelCode: fuelType,
                            //            engineCode: engineSize
                            //        };
                            //        $scope.fuels.forEach(function (item) {
                            //            if (fuelType == item.code) {
                            //                piece.fuelType = item.description;
                            //                item.engineSizes.forEach(function (minor) {
                            //                    if (engineSize == minor.code) {
                            //                        piece.engineSize = minor.description;
                            //                    }
                            //                });
                            //            }
                            //        });
                            //        //logs(piece, 'Piece');
                            //        if (piece.fuelCode == '1' && piece.engineCode == '1') {
                            //            $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat =
                            //                $scope.system.mileageRates.petrolUpTo1400 * $scope.globalVat;
                            //        } else if (piece.fuelCode == '2' && piece.engineCode == '1') {
                            //            $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat =
                            //                $scope.system.mileageRates.dieselUpTo1600 * $scope.globalVat;
                            //        } else if (piece.fuelCode == '3' && piece.engineCode == '1') {
                            //            $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat =
                            //                $scope.system.mileageRates.lpgUpTo1400 * $scope.globalVat;
                            //        }
                            //    } else if ($scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name == 'Motorbike') {
                            //        //logs('is is motorbike');
                            //        $scope.expensesArray[expenseIndex].expenses[i].value = valuesForTransport[1];
                            //        $scope.cloned[expenseIndex].expenses[i].value = valuesForTransport[1];
                            //    } else if ($scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name == 'Bicycle') {
                            //        //logs('is bicycle');
                            //        $scope.expensesArray[expenseIndex].expenses[i].value = valuesForTransport[2];
                            //        $scope.cloned[expenseIndex].expenses[i].value = valuesForTransport[2];
                            //    }
                            //}

                            // recalculating total based on vat, amount and value
                            $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.total = 0;
                            $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.total +=
                            $scope.expensesArray[expenseIndex].expenses[i].amount * $scope.expensesArray[expenseIndex].expenses[i].value ? $scope.expensesArray[expenseIndex].expenses[i].amount * $scope.expensesArray[expenseIndex].expenses[i].value : 0;
                            $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.total +=
                            $scope.expensesArray[expenseIndex].expenses[i].amount * $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat ? $scope.expensesArray[expenseIndex].expenses[i].amount * $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat : 0;
                            $scope.expensesArray[expenseIndex].total += $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.total;
                        }
                        // $http.get('/api/candidates/expenses').success(function (expenses) {
                        //     $scope.expensesArray[expenseIndex].total = expenses.object[expenseIndex].total;
                        //     var checked = $scope.expensesArray[expenseIndex].expenses[i].checked;
                        //     $scope.expensesArray[expenseIndex].expenses[i] = expenses.object[expenseIndex].expenses[i];
                        //     //$scope.expensesArray[i].expenses[j].date = new Date($scope.expensesArray[i].expenses[j].date);
                        //     $scope.expensesArray[expenseIndex].expenses[i].checked = checked;
                        //     $scope.expensesArray[expenseIndex].expenses[i].validDates = getWeek($scope.expensesArray[expenseIndex].startDate);
                        //     //if ($scope.expensesArray[expenseIndex].expenses[i].expenseDetail && $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat) {
                        //     //    $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat = $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat.slice(0, -1);
                        //     //}
                        // });
                    });
                } else {
                    for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                        if ($scope.expensesArray[expenseIndex].expenses[i]._id === itemId) {
                            angular.copy($scope.expensesArray[expenseIndex].expenses[i], $scope.cloned[expenseIndex].expenses[i]);
                            break;
                        }
                    }
                }
            };

            $scope.deleteSelected = function (expenseIndex, category) {
                var req = {};
                req.expenseIds = [];
                var indeces = [];
                for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                    if ($scope.expensesArray[expenseIndex].expenses[i].checked
                        && $scope.expensesArray[expenseIndex].expenses[i].expenseType == category) {
                        req.expenseIds.push($scope.expensesArray[expenseIndex].expenses[i]._id);
                        indeces.push(i);
                    }
                }
                //logs(req);
                $http.post('/api/candidates/expenses', req).success(function (res) {
                    //logs(res, indeces);
                    if (res.result) {
                        for (var i = 0; i < indeces.length; i++) {
                            $scope.expensesArray[expenseIndex].expenses.splice(indeces[i] - i, 1);
                        }
                        $scope.expensesArray[expenseIndex].categories = [];
                        for (var j = 0; j < $scope.expensesArray[expenseIndex].expenses.length; j++) {
                            if ($scope.expensesArray[expenseIndex].categories.indexOf($scope.expensesArray[expenseIndex].expenses[j].expenseType) == -1) {
                                $scope.expensesArray[expenseIndex].categories.push($scope.expensesArray[expenseIndex].expenses[j].expenseType);
                            }
                        }
                        angular.copy($scope.expensesArray[expenseIndex].expenses, $scope.cloned[expenseIndex].expenses);
                    }
                });
            };

            $scope.selectAll = function (expenseIndex, category) {
                for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                    if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == category) {
                        $scope.expensesArray[expenseIndex].expenses[i].checked = true;
                    }
                }
            };

            $scope.inverseSelection = function (expenseIndex, category) {
                for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                    if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == category) {
                        if ($scope.expensesArray[expenseIndex].expenses[i].checked) {
                            $scope.expensesArray[expenseIndex].expenses[i].checked = false;
                        } else {
                            $scope.expensesArray[expenseIndex].expenses[i].checked = true;
                        }
                    }
                }
            };

            $scope.approveSelected = function (expenseIndex, category) {
                var expToApprove = [];
                var ids = [];
                var claimInfo = [];
                for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                    if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == category
                        && $scope.expensesArray[expenseIndex].expenses[i].checked) {
                        expToApprove.push($scope.expensesArray[expenseIndex].expenses[i]);
                        ids.push($scope.expensesArray[expenseIndex].claimReference);
                        claimInfo.push({
                            claimId: $scope.expensesArray[expenseIndex].id,
                            userName: $scope.expensesArray[expenseIndex].user.firstName + ' ' + $scope.expensesArray[expenseIndex].user.lastName
                        });
                    }
                }
                if (ids.length == 0) window.alert('No items selected');
                else approve(expToApprove, claimInfo);
            }

            $scope.rejectSelected = function (expenseIndex, category) {
                var expToReject = [];
                var ids = [];
                var claimInfo = [];
                for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                    if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == category
                        && $scope.expensesArray[expenseIndex].expenses[i].checked) {
                        expToReject.push($scope.expensesArray[expenseIndex].expenses[i]);
                        ids.push($scope.expensesArray[expenseIndex].claimReference);
                        claimInfo.push({
                            claimId: $scope.expensesArray[expenseIndex].id,
                            userName: $scope.expensesArray[expenseIndex].user.firstName + ' ' + $scope.expensesArray[expenseIndex].user.lastName
                        });
                    }
                }
                if (ids.length == 0) window.alert('No items selected');
                else reject(expToReject, claimInfo);
            }

            $scope.approveMajorSelected = function () {
                var expToApprove = [];
                var ids = [];
                var claimInfo = [];
                for (var i = 0; i < $scope.expensesArray.length; i++) {
                    if ($scope.expensesArray[i].majorChecked) {
                        for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                            expToApprove.push($scope.expensesArray[i].expenses[j]);
                            ids.push($scope.expensesArray[i].claimReference);
                            claimInfo.push({
                                claimId: $scope.expensesArray[i].id,
                                userName: $scope.expensesArray[i].user.firstName + ' ' + $scope.expensesArray[i].user.lastName
                            });
                        }
                    }
                }
                if (ids.length == 0) window.alert('No claims selected, or selected claims are empty');
                else approve(expToApprove, claimInfo);
            }

            $scope.rejectMajorSelected = function () {
                var expToReject = [];
                var ids = [];
                var claimInfo = [];
                for (var i = 0; i < $scope.expensesArray.length; i++) {
                    if ($scope.expensesArray[i].majorChecked) {
                        for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                            expToReject.push($scope.expensesArray[i].expenses[j]);
                            ids.push($scope.expensesArray[i].claimReference);
                            claimInfo.push({
                                claimId: $scope.expensesArray[i].id,
                                userName: $scope.expensesArray[i].user.firstName + ' ' + $scope.expensesArray[i].user.lastName
                            });
                        }
                    }
                }
                if (ids.length == 0) window.alert('No claims selected, or selected claims are empty');
                else reject(expToReject, claimInfo);
            };

            $scope.majorSelectAll = function () {
                for (var i = 0; i < $scope.expensesArray.length; i++) {
                    $scope.expensesArray[i].majorChecked = true;
                }
            };

            $scope.majorInverseSelection = function () {
                for (var i = 0; i < $scope.expensesArray.length; i++) {
                    if ($scope.expensesArray[i].majorChecked) {
                        $scope.expensesArray[i].majorChecked = false;
                    } else {
                        $scope.expensesArray[i].majorChecked = true;
                    }
                }
            };

            $scope.majorDeleteSelected = function () {
                var req = {};
                req.expenseIds = [];
                var indeces = [];
                for (var i = 0; i < $scope.expensesArray.length; i++) {
                    if ($scope.expensesArray[i].majorChecked) {
                        indeces.push(i);
                        for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                            req.expenseIds.push($scope.expensesArray[i].expenses[j]._id);
                        }
                    }
                }
                //logs(req);
                $http.post('/api/candidates/expenses', req).success(function (res) {
                    //logs(res, indeces);
                    if (res.result) {
                        for (var i = 0; i < indeces.length; i++) {
                            $scope.expensesArray.splice(indeces[i] - i, 1);
                        }
                        angular.copy($scope.expensesArray, $scope.cloned);
                    }
                });
            }

            function approve(exp, claimInfo) {
                var uniqueClaimIds = [];
                claimInfo.forEach(function (info) {
                    if (uniqueClaimIds.indexOf(info.claimId) == -1) {
                        uniqueClaimIds.push(info.claimId);
                    }
                });
                var req = {};
                req.objects = [];
                uniqueClaimIds.forEach(function (uniId) {
                    var obj = {
                        claimId: uniId,
                        expenses: []
                    };
                    exp.forEach(function (item, i) {
                        if (claimInfo[i].claimId == uniId) {
                            var data = {
                                id: item._id,
                                reason: ''
                            }
                            obj.expenses.push(data);
                        }
                    });
                    req.objects.push(obj);
                });
                logs(req, 'approve expenses request');
                $http.patch('/api/candidates/expenses/approve', req).success(function (res) {
                    if (res.result) {
                        req.objects.forEach(function (claim) {
                            claim.expenses.forEach(function (exp) {
                                for (var i = 0; i < $scope.expensesArray.length; i++) {
                                    var found = false;
                                    for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                                        if ($scope.expensesArray[i].expenses[j]._id == exp.id) {
                                            $scope.expensesArray[i].expenses[j].status = 'approved';
                                            if ($scope.pendingRejections.indexOf($scope.expensesArray[i].expenses[j]) != -1) {
                                                $scope.pendingRejections.splice(
                                                    $scope.pendingRejections.indexOf($scope.expensesArray[i].expenses[j]), 1);
                                            }
                                            found = true;
                                            break
                                        }
                                    }
                                    if (found) break
                                }
                            });
                        });
                        angular.copy($scope.expensesArray, $scope.cloned);
                    }
                });
            }

            function reject(exp, claimInfo) {
                var uniqueClaimIds = [];
                claimInfo.forEach(function (info) {
                    if (uniqueClaimIds.indexOf(info.claimId) == -1) {
                        uniqueClaimIds.push(info.claimId);
                    }
                });
                var req = {};
                req.objects = [];
                uniqueClaimIds.forEach(function (uniId) {
                    var obj = {
                        claimId: uniId,
                        expenses: []
                    };
                    exp.forEach(function (item, i) {
                        if (claimInfo[i].claimId == uniId) {
                            if ($scope.pendingRejections.indexOf(item) == -1) {
                                $scope.pendingRejections.push(item);
                            }
                            var data = {
                                id: item._id,
                                reason: ''
                            }
                            obj.expenses.push(data);
                        }
                    });
                    req.objects.push(obj);
                });
                logs(req, 'reject expenses request');
                Notification.primary('Marked for Rejection');
                req.objects.forEach(function (claim) {
                    claim.expenses.forEach(function (exp) {
                        for (var i = 0; i < $scope.expensesArray.length; i++) {
                            var found = false;
                            for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                                if ($scope.expensesArray[i].expenses[j]._id == exp.id) {
                                    $scope.expensesArray[i].expenses[j].origStatus = $scope.expensesArray[i].expenses[j].status;
                                    $scope.expensesArray[i].expenses[j].status = 'rejected';
                                    found = true;
                                    break
                                }
                            }
                            if (found) break
                        }
                    });
                });
                angular.copy($scope.expensesArray, $scope.cloned);
                //$http.patch('/api/candidates/expenses/reject', req).success(function (res) {
                //    if (res.result) {

                //    }
                //});
            }

            function reviewSummaryModal(size, items, claimInfo, rootScope) {
                var modalInstance = $modal.open({
                    templateUrl: 'views/activity/reject_summary.html',
                    controller: 'rejectSummaryCtrl',
                    size: size,
                    resolve: {
                        item: function () {
                            return items;
                        },
                        claimInfo: function () {
                            return claimInfo;
                        },
                        rootScope: function () {
                            return rootScope;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    logs('Successfully Rejected');
                    $scope.pendingRejections = [];
                }, function (msg) {
                        logs(msg, 'Dismissed');
                        //logs($scope.summary, 'summary');
                    });
            }

            $scope.reviewSummary = function () {
                var claimInfo = [];
                for (var k = 0; k < $scope.pendingRejections.length; k++) {
                    for (var i = 0; i < $scope.expensesArray.length; i++) {
                        var found = false;
                        for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                            if ($scope.expensesArray[i].expenses[j]._id == $scope.pendingRejections[k]._id) {
                                claimInfo.push({
                                    claimId: $scope.expensesArray[i].id,
                                    claimRef: $scope.expensesArray[i].claimReference,
                                    userName: $scope.expensesArray[i].user.firstName + ' ' + $scope.expensesArray[i].user.lastName
                                });
                                found = true;
                                break
                            }
                        }
                        if (found) break
                    }
                }
                reviewSummaryModal('lg', $scope.pendingRejections, claimInfo, $scope);
            }

            $scope.cancelRejections = function () {
                var req = {};
                req.body = [];
                var indeces = [];
                $scope.pendingRejections.forEach(function (item) {
                    for (var i = 0; i < $scope.expensesArray.length; i++) {
                        var found = false;
                        for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                            if ($scope.expensesArray[i].expenses[j]._id == item._id) {
                                $scope.expensesArray[i].expenses[j].status = $scope.expensesArray[i].expenses[j].origStatus;
                                //var subType = '';
                                //if ($scope.expensesArray[i].expenses[j].expenseType == 'Subsistence') {
                                //    for (var k = 0; k < $scope.mealTypes.length; k++) {
                                //        var newSub = $scope.expensesArray[i].expenses[j].expenseDetail.name;
                                //        if (newSub == $scope.mealTypes[k].name) {
                                //            subType = $scope.mealTypes[k]._id;
                                //            $scope.expensesArray[i].expenses[j].expenseDetail.id = subType;
                                //            break;
                                //        }
                                //    }
                                //} else if ($scope.expensesArray[i].expenses[j].expenseType == 'Other') {
                                //    for (var k = 0; k < $scope.otherTypes.length; k++) {
                                //        var newSub = $scope.expensesArray[i].expenses[j].expenseDetail.name;
                                //        if (newSub == $scope.otherTypes[k].name) {
                                //            subType = $scope.otherTypes[k]._id;
                                //            $scope.expensesArray[i].expenses[j].expenseDetail.id = subType;
                                //            break;
                                //        }
                                //    }
                                //} else {
                                //    subType = $scope.expensesArray[i].expenses[j].expenseDetail.name;
                                //}

                                //req.body.push({
                                //    expenseType: $scope.expensesArray[i].expenses[j].expenseType,
                                //    subType: subType,
                                //    date: $scope.expensesArray[i].expenses[j].date,
                                //    value: $scope.expensesArray[i].expenses[j].amount,
                                //    id: $scope.expensesArray[i].expenses[j]._id,
                                //    claimId: $scope.expensesArray[i].id,
                                //    receiptUrls: $scope.expensesArray[i].expenses[j].receiptUrls,
                                //    status: 'submitted'
                                //});
                                //indeces.push({
                                //    claimIndex: i,
                                //    expenseIndex: j
                                //});
                                found = true;
                                break
                            }
                        }
                        if (found) break
                    }
                });
                //logs(req, 'request');
                //$http.put('/api/candidates/expenses/edit', req).success(function (res) {
                //    logs(res, 'Edit Response');
                //    if (res.result) {
                //        for (var i = 0; i < indeces.length; i++) {
                //            $scope.expensesArray[indeces[i].claimIndex].expenses[indeces[i].expenseIndex].status = 'submitted';
                //            $scope.cloned[indeces[i].claimIndex].expenses[indeces[i].expenseIndex].status = 'submitted';
                //        }
                //    }
                //});
                $scope.pendingRejections = [];
            }

            $scope.cancel = function (claimId, expenseId) {
                for (var i = 0; i < $scope.pendingRejections.length; i++) {
                    if ($scope.pendingRejections[i]._id == expenseId) {
                        $scope.pendingRejections[i].status = $scope.pendingRejections[i].origStatus;
                        $scope.pendingRejections.splice(i, 1);
                        break
                    }
                }
                //for (var i = 0; i < $scope.expensesArray.length; i++) {
                //    if ($scope.expensesArray[i].id == claimId) {
                //        for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                //            if ($scope.expensesArray[i].expenses[j]._id == expenseId) {
                //                var req = {};
                //                req.body = [];
                //                var subType = '';
                //                if ($scope.expensesArray[i].expenses[j].expenseType == 'Subsistence') {
                //                    for (var k = 0; k < $scope.mealTypes.length; k++) {
                //                        var newSub = $scope.expensesArray[i].expenses[j].expenseDetail.name;
                //                        if (newSub == $scope.mealTypes[k].name) {
                //                            subType = $scope.mealTypes[k]._id;
                //                            $scope.expensesArray[i].expenses[j].expenseDetail.id = subType;
                //                            break;
                //                        }
                //                    }
                //                } else if ($scope.expensesArray[i].expenses[j].expenseType == 'Other') {
                //                    for (var k = 0; k < $scope.otherTypes.length; k++) {
                //                        var newSub = $scope.expensesArray[i].expenses[j].expenseDetail.name;
                //                        if (newSub == $scope.otherTypes[k].name) {
                //                            subType = $scope.otherTypes[k]._id;
                //                            $scope.expensesArray[i].expenses[j].expenseDetail.id = subType;
                //                            break;
                //                        }
                //                    }
                //                } else {
                //                    subType = $scope.expensesArray[i].expenses[j].expenseDetail.name;
                //                }

                //                req.body.push({
                //                    expenseType: $scope.expensesArray[i].expenses[j].expenseType,
                //                    subType: subType,
                //                    date: $scope.expensesArray[i].expenses[j].date,
                //                    value: $scope.expensesArray[i].expenses[j].amount,
                //                    id: $scope.expensesArray[i].expenses[j]._id,
                //                    claimId: $scope.expensesArray[i].id,
                //                    receiptUrls: $scope.expensesArray[i].expenses[j].receiptUrls,
                //                    status: 'submitted'
                //                });
                //                //logs(req, 'request');
                //                $http.put('/api/candidates/expenses/edit', req).success(function (res) {
                //                    logs(res, 'Edit Response');
                //                    if (res.result) {
                //                        $scope.expensesArray[i].expenses[j].status = 'submitted';
                //                        $scope.cloned[i].expenses[j].status = 'submitted';
                //                    }
                //                });
                //                break
                //            }
                //        }
                //        break
                //    }
                //}
            }

            $scope.viewReceipt = function (expense, claim) {
                //logs(expense.receiptUrls, 'URLs');
                var modalInstance = $modal.open({
                    templateUrl: 'views/activity/expenseReceipt.html',
                    controller: 'expenseReceiptCtrl',
                    size: 'md',
                    resolve: {
                        rootScope: function () {
                            return $scope;
                        },
                        expense: function () {
                            return expense;
                        },
                        claim: function () {
                            return claim;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    saveAnyway();
                }, function (msg) {
                        saveAnyway();
                    });
                function saveAnyway() {
                    //logs(expense, 'new expense');
                    var req = {};
                    req.body = [];
                    var subType = '';
                    if (expense.expenseType == 'Subsistence') {
                        for (var j = 0; j < $scope.mealTypes.length; j++) {
                            var newSub = expense.expenseDetail.name;
                            if (newSub == $scope.mealTypes[j].name) {
                                subType = $scope.mealTypes[j]._id;
                                expense.expenseDetail.id = subType;
                                break;
                            }
                        }
                    } else if (expense.expenseType == 'Other') {
                        for (var j = 0; j < $scope.otherTypes.length; j++) {
                            var newSub = expense.expenseDetail.name;
                            if (newSub == $scope.otherTypes[j].name) {
                                subType = $scope.otherTypes[j]._id;
                                expense.expenseDetail.id = subType;
                                break;
                            }
                        }
                    } else {
                        subType = expense.expenseDetail.name;
                    }

                    //logs(expense.date);
                    req.body.push({
                        expenseType: expense.expenseType,
                        subType: subType,
                        date: expense.date,
                        amount: expense.amount,
                        value: expense.value,
                        vat: expense.expenseDetail.vat,
                        total: expense.expenseDetail.total,
                        id: expense._id,
                        claimId: claim.id,
                        receiptUrls: expense.receiptUrls,
                        status: expense.status
                    });

                    $http.put('/api/candidates/expenses/edit', req).success(function (res) {
                        logs(res, 'Edit Response');
                    });
                }
            }

            function logs(record, label) {
//                if (label) console.log(label + ':', record);
//                else console.log(record);
            }

        }]);

