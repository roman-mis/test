'use strict';
var app = angular.module('origApp.controllers');

app.controller("expensesAuthorizationCtrl",
    ['$scope', '$http', '$rootScope', 'HttpResource', 'ConstantsResource', '$modal',
    function ($scope, $http, $rootScope, HttpResource, ConstantsResource, $modal) {

        $rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
                                  { link: '/activity/home', text: 'Activity' },
                                  { link: '/activity/expensesAuthorization', text: 'Expenses Authorisation' }
        ];
        $scope.transportTypes = ConstantsResource.get('transportationmeans');
        $scope.mealTypes = HttpResource.model('systems/expensesrates/expensesratetype/subsistence').query({});
        $http.get('/api/constants/expenseClaimStatus').success(function (res) {
            $scope.expenseClaimStatus = res;
        });
        $http.get('/api/constants/expenseStatus').success(function (res) {
            $scope.expenseStatus = res;
        });
        $scope.otherTypes = HttpResource.model('systems/expensesrates/expensesratetype/other').query({});

        $http.get('/api/constants/fuels').success(function (res) {
            logs(res, 'fuels');
            $scope.fuels = res;
        });
        //$http.get('/api/constants/enginesizes').success(function (res) {
        //    logs(res, 'engine sizes')
        //});

        $scope.pendingRejections = [];

        $http.get('/api/candidates/expenses').success(function (expenses) {
            logs('getting expenses done !!');
            $scope.system = expenses.object.system[0];
            logs($scope.system, 'system doc');
            $scope.expensesArray = expenses.object.claims;

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

        function getVehicleInfo(userId, code) {
            $http.get('/api/candidates/' + userId + '/vehicleinformation/' + code).success(function (res) {
                logs(res, 'vehicle info')
            });
        }

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
                        }
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
                        if (piece.fuelCode == '1' && piece.engineCode == '1') {
                            $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                $scope.system.mileageRates.petrolUpTo1400 * $scope.globalVat;
                        } else if (piece.fuelCode == '2' && piece.engineCode == '1') {
                            $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                $scope.system.mileageRates.dieselUpTo1600 * $scope.globalVat;
                        } else if (piece.fuelCode == '3' && piece.engineCode == '1') {
                            $scope.expensesArray[i].expenses[j].expenseDetail.vat =
                                $scope.system.mileageRates.lpgUpTo1400 * $scope.globalVat;
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
                        if ($scope.expensesArray[expenseIndex].expenses[i] != $scope.cloned[expenseIndex].expenses[i].status
                            && $scope.cloned[expenseIndex].expenses[i].status == 'rejected') {
                            if ($scope.pendingRejections.indexOf($scope.expensesArray[expenseIndex].expenses[i]) == -1) {
                                $scope.pendingRejections.push($scope.expensesArray[expenseIndex].expenses[i]);
                            }
                        }
                        if ($scope.expensesArray[expenseIndex].expenses[i] != $scope.cloned[expenseIndex].expenses[i].status
                            && $scope.expensesArray[expenseIndex].expenses[i].status == 'rejected'
                            && $scope.pendingRejections.indexOf($scope.expensesArray[expenseIndex].expenses[i]) != -1) {
                            $scope.pendingRejections.splice(
                                $scope.pendingRejections.indexOf($scope.expensesArray[expenseIndex].expenses[i]), 1);
                        }
                        angular.copy($scope.cloned[expenseIndex].expenses[i], $scope.expensesArray[expenseIndex].expenses[i]);
                        var subType = '';
                        if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == 'Subsistence') {
                            for (var j = 0; j < $scope.mealTypes.length; j++) {
                                var newSub = $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name;
                                if (newSub == $scope.mealTypes[j].name) {
                                    subType = $scope.mealTypes[j]._id;
                                    $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.id = subType;
                                    break;
                                }
                            }
                        } else if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == 'Other') {
                            for (var j = 0; j < $scope.otherTypes.length; j++) {
                                var newSub = $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name;
                                if (newSub == $scope.otherTypes[j].name) {
                                    subType = $scope.otherTypes[j]._id;
                                    $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.id = subType;
                                    break;
                                }
                            }
                        } else {
                            subType = $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name;
                        }
                        //logs($scope.expensesArray[expenseIndex].expenses[i].date);
                        req.body.push({
                            expenseType: $scope.expensesArray[expenseIndex].expenses[i].expenseType,
                            subType: subType,
                            date: $scope.expensesArray[expenseIndex].expenses[i].date,
                            value: $scope.expensesArray[expenseIndex].expenses[i].amount,
                            id: $scope.expensesArray[expenseIndex].expenses[i]._id,
                            claimId: $scope.expensesArray[expenseIndex].id,
                            receiptUrls: $scope.expensesArray[expenseIndex].expenses[i].receiptUrls,
                            status: $scope.expensesArray[expenseIndex].expenses[i].status
                        });
                        //logs(req.body);
                        break;
                    }
                }
                //logs(req);
                $http.put('/api/candidates/expenses/edit', req).success(function (res) {
                    logs(res, 'Edit Response');
                    $scope.expensesArray[expenseIndex].total = 0;
                    for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                        // recalculating vat for Subsistence and Other
                        $scope.system.expensesRate.forEach(function (doc) {
                            if ($scope.expensesArray[expenseIndex].expenses[i].expenseDetail.id == doc._id) {
                                if (doc.taxApplicable) {
                                    $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat =
                                        $scope.expensesArray[expenseIndex].expenses[i].value * $scope.globalVat;
                                } else {
                                    $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat = 0;
                                }
                            }
                        });

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
        }

        $scope.majorSelectAll = function () {
            for (var i = 0; i < $scope.expensesArray.length; i++) {
                $scope.expensesArray[i].majorChecked = true;
            }
        }

        $scope.majorInverseSelection = function () {
            for (var i = 0; i < $scope.expensesArray.length; i++) {
                if ($scope.expensesArray[i].majorChecked) {
                    $scope.expensesArray[i].majorChecked = false;
                } else {
                    $scope.expensesArray[i].majorChecked = true;
                }
            }
        }

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
            console.log(req);
            $http.patch('/api/candidates/expenses/approve', req).success(function (res) {
                //console.log(res);
                $http.get('/api/candidates/expenses').success(function (expenses) {
                    for (var i = 0; i < $scope.expensesArray.length; i++) {
                        for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                            $scope.expensesArray[i].expenses[j].status = expenses.object.claims[i].expenses[j].status;
                            if ($scope.expensesArray[i].expenses[j].status != 'rejected'
                                && $scope.pendingRejections.indexOf($scope.expensesArray[i].expenses[j]) != -1) {
                                $scope.pendingRejections.splice(
                                    $scope.pendingRejections.indexOf($scope.expensesArray[i].expenses[j]), 1);
                            }

                        }
                    }
                    angular.copy($scope.expensesArray, $scope.cloned);
                });
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
            console.log(req);
            $http.patch('/api/candidates/expenses/reject', req).success(function (res) {
                //console.log(res);
                $http.get('/api/candidates/expenses').success(function (expenses) {
                    for (var i = 0; i < $scope.expensesArray.length; i++) {
                        for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                            $scope.expensesArray[i].expenses[j].status = expenses.object.claims[i].expenses[j].status;
                        }
                    }
                    angular.copy($scope.expensesArray, $scope.cloned);
                });
            });
        }

        function reviewSummaryModal(size, items, claimInfo) {
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
                    }
                }
            });

            modalInstance.result.then(function () {
                $http.get('/api/candidates/expenses').success(function (expenses) {
                    for (var i = 0; i < $scope.expensesArray.length; i++) {
                        for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                            $scope.expensesArray[i].expenses[j].status = expenses.object.claims[i].expenses[j].status;

                        }
                    }
                    angular.copy($scope.expensesArray, $scope.cloned);
                });
            }, function () {
                logs("Dismissed");
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
                                categories: $scope.expensesArray[i].categories,
                                userName: $scope.expensesArray[i].user.firstName + ' ' + $scope.expensesArray[i].user.lastName
                            });
                            found = true;
                            break
                        }
                    }
                    if (found) break
                }
            }
            reviewSummaryModal('lg', $scope.pendingRejections, claimInfo);
        }

        function logs(record, label) {
            if (label) console.log(label + ':', record);
            else console.log(record);
        }

    }]);