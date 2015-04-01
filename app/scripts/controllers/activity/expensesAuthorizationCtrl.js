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

        $http.get('/api/candidates/expenses').success(function (expenses) {
            logs('getting expenses done !!');
            logs(expenses.object.system);
            $scope.expensesArray = expenses.object.claims;
            init();
        });

        function init() {
            for (var i = 0; i < $scope.expensesArray.length; i++) {
                $scope.expensesArray[i].startDate = getMonday($scope.expensesArray[i].claimDate);
                $scope.expensesArray[i].categories = [];
                $scope.expensesArray[i].majorChecked = false;
                $scope.expensesArray[i].total = 0;
                for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                    $scope.expensesArray[i].expenses[j].checked = false;
                    $scope.expensesArray[i].expenses[j].edit = false;
                    $scope.expensesArray[i].expenses[j].expenseDetail.total = 0;
                    $scope.expensesArray[i].expenses[j].expenseDetail.total +=
                        $scope.expensesArray[i].expenses[j].amount * $scope.expensesArray[i].expenses[j].value ? $scope.expensesArray[i].expenses[j].amount * $scope.expensesArray[i].expenses[j].value : 0;
                    $scope.expensesArray[i].expenses[j].expenseDetail.total +=
                        $scope.expensesArray[i].expenses[j].amount * $scope.expensesArray[i].expenses[j].expenseDetail.vat ? $scope.expensesArray[i].expenses[j].amount * $scope.expensesArray[i].expenses[j].expenseDetail.vat : 0;
                    $scope.expensesArray[i].total += $scope.expensesArray[i].expenses[j].expenseDetail.total;
                    //logs($scope.expensesArray[i].expenses[j].amount);
                    //logs($scope.expensesArray[i].expenses[j].expenseDetail.vat);
                    //logs($scope.expensesArray[i].expenses[j].value);
                    //logs($scope.expensesArray[i].expenses[j].expenseDetail.total);
                    //logs($scope.expensesArray[i].expenses[j].date);
                    $scope.expensesArray[i].expenses[j].date = new Date($scope.expensesArray[i].expenses[j].date);
                    $scope.expensesArray[i].expenses[j].date.setHours(0, 0, 0, 0);
                    $scope.expensesArray[i].expenses[j].date = $scope.expensesArray[i].expenses[j].date.toISOString();
                    $scope.expensesArray[i].expenses[j].validDates = getWeek($scope.expensesArray[i].expenses[j].date);
                    //if (i == 0 && j == 0) {
                    //    logs(new Date($scope.expensesArray[i].claimDate));
                    //    logs($scope.expensesArray[i].expenses[j].date);
                    //    logs($scope.expensesArray[i].expenses[j].validDates);
                    //}
                    //if ($scope.expensesArray[i].expenses[j].expenseDetail && $scope.expensesArray[i].expenses[j].expenseDetail.vat) {
                    //    $scope.expensesArray[i].expenses[j].expenseDetail.vat = $scope.expensesArray[i].expenses[j].expenseDetail.vat.slice(0, -1);
                    //}
                    if ($scope.expensesArray[i].categories.indexOf($scope.expensesArray[i].expenses[j].expenseType) == -1) {
                        $scope.expensesArray[i].categories.push($scope.expensesArray[i].expenses[j].expenseType);
                    }
                }
            }
            $scope.cloned = [];
            angular.copy($scope.expensesArray, $scope.cloned);
            logs($scope.expensesArray);
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
                var date = new Date(new Date().setDate(start.getDate() + i));
                date.setHours(0, 0, 0, 0);
                days.push(date.toISOString());
            }
            return days;
        }

        $scope.finishEditing = function (expenseIndex, itemId, save) {
            //console.log(expenseIndex, itemId);
            if (save) {
                var req = {};
                req.body = [];
                for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                    if ($scope.expensesArray[expenseIndex].expenses[i]._id === itemId) {
                        angular.copy($scope.cloned[expenseIndex].expenses[i], $scope.expensesArray[expenseIndex].expenses[i]);
                        var subType = '';
                        if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == 'Subsistence') {
                            for (var j = 0; j < $scope.mealTypes.length; j++) {
                                var newSub = $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name;
                                if (newSub == $scope.mealTypes[j].name) {
                                    subType = $scope.mealTypes[j]._id;
                                    break;
                                }
                            }
                        } else if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == 'Other') {
                            for (var j = 0; j < $scope.otherTypes.length; j++) {
                                var newSub = $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name;
                                if (newSub == $scope.otherTypes[j].name) {
                                    subType = $scope.otherTypes[j]._id;
                                    break;
                                }
                            }
                        } else {
                            subType = $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name;
                        }
                        console.log($scope.expensesArray[expenseIndex].expenses[i].date);
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
                    logs(res);
                    $scope.expensesArray[expenseIndex].total = 0;
                    for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
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
                //console.log(res, indeces);
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
            var claimIds = [];
            for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == category
                    && $scope.expensesArray[expenseIndex].expenses[i].checked) {
                    expToApprove.push($scope.expensesArray[expenseIndex].expenses[i]);
                    ids.push($scope.expensesArray[expenseIndex].claimReference);
                    claimIds.push($scope.expensesArray[expenseIndex].id);
                }
            }
            if (ids.length == 0) window.alert('No items selected');
            else open('lg', expToApprove, ids, claimIds, true);
        }

        $scope.rejectSelected = function (expenseIndex, category) {
            var expToReject = [];
            var ids = [];
            var claimIds = [];
            for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == category
                    && $scope.expensesArray[expenseIndex].expenses[i].checked) {
                    expToReject.push($scope.expensesArray[expenseIndex].expenses[i]);
                    ids.push($scope.expensesArray[expenseIndex].claimReference);
                    claimIds.push($scope.expensesArray[expenseIndex].id);
                }
            }
            if (ids.length == 0) window.alert('No items selected');
            else open('lg', expToReject, ids, claimIds, false);
        }

        $scope.approveMajorSelected = function () {
            var expToApprove = [];
            var ids = [];
            var claimIds = [];
            for (var i = 0; i < $scope.expensesArray.length; i++) {
                if ($scope.expensesArray[i].majorChecked) {
                    for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                        expToApprove.push($scope.expensesArray[i].expenses[j]);
                        ids.push($scope.expensesArray[i].claimReference);
                        claimIds.push($scope.expensesArray[i].id);
                    }
                }
            }
            if (ids.length == 0) window.alert('No claims selected, or selected claims are empty');
            else open('lg', expToApprove, ids, claimIds, true);
        }

        $scope.rejectMajorSelected = function () {
            var expToReject = [];
            var ids = [];
            var claimIds = [];
            for (var i = 0; i < $scope.expensesArray.length; i++) {
                if ($scope.expensesArray[i].majorChecked) {
                    for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                        expToReject.push($scope.expensesArray[i].expenses[j]);
                        ids.push($scope.expensesArray[i].claimReference);
                        claimIds.push($scope.expensesArray[i].id);
                    }
                }
            }
            if (ids.length == 0) window.alert('No claims selected, or selected claims are empty');
            else open('lg', expToReject, ids, claimIds, false);
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
                //console.log(res, indeces);
                if (res.result) {
                    for (var i = 0; i < indeces.length; i++) {
                        $scope.expensesArray.splice(indeces[i] - i, 1);
                    }
                    angular.copy($scope.expensesArray, $scope.cloned);
                }
            });
        }

        function open(size, itemToEdit, ids, claimIds, approve) {
            var modalInstance = $modal.open({
                templateUrl: 'views/activity/approve_reject_expenses.html',
                controller: 'approvingRejectingCtrl',
                size: size,
                resolve: {
                    item: function () {
                        return itemToEdit;
                    },
                    approve: function () {
                        return approve;
                    },
                    ids: function () {
                        return ids;
                    },
                    claimIds: function () {
                        return claimIds;
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

        function logs(record) {
            console.log(record);
        }

    }]);