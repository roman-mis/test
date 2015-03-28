'use strict';
var app = angular.module('origApp.controllers');

app.controller("expensesAuthorizationCtrl",
    ['$scope', '$http', '$rootScope', 'HttpResource', 'ConstantsResource',
    function ($scope, $http, $rootScope, HttpResource, ConstantsResource) {

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
            console.log('getting expenses done !!');
            console.log(expenses);
            $scope.expensesArray = expenses.object;
            init();
        });

        function init() {

            for (var i = 0; i < $scope.expensesArray.length; i++) {
                $scope.expensesArray[i].startDate = getMonday($scope.expensesArray[i].claimDate);
                $scope.expensesArray[i].categories = [];
                for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                    $scope.expensesArray[i].expenses[j].checked = false;
                    $scope.expensesArray[i].expenses[j].edit = false;
                    if ($scope.expensesArray[i].expenses[j].expenseDetail && $scope.expensesArray[i].expenses[j].expenseDetail.vat) {
                        $scope.expensesArray[i].expenses[j].expenseDetail.vat = $scope.expensesArray[i].expenses[j].expenseDetail.vat.slice(0, -1);
                    }
                    if ($scope.expensesArray[i].categories.indexOf($scope.expensesArray[i].expenses[j].expenseType) == -1) {
                        $scope.expensesArray[i].categories.push($scope.expensesArray[i].expenses[j].expenseType);
                    }
                }
            }
            $scope.cloned = [];
            angular.copy($scope.expensesArray, $scope.cloned);
            console.log($scope.expensesArray);
            console.log("finished!!!")
        }

        function getMonday(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        }

        $scope.finishEditing = function (expenseIndex, itemId, save) {
            //console.log($scope.mealTypes);
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
                        req.body.push({
                            expenseType: $scope.expensesArray[expenseIndex].expenses[i].expenseType,
                            subType: subType,
                            date: $scope.expensesArray[expenseIndex].expenses[i].date,
                            value: $scope.expensesArray[expenseIndex].expenses[i].amount,
                            id: $scope.expensesArray[expenseIndex].expenses[i]._id,
                            receiptUrls: $scope.expensesArray[expenseIndex].expenses[i].receiptUrls,
                            status: $scope.expensesArray[expenseIndex].expenses[i].status
                        });
                        break;
                    }
                }
                //console.log(req);
                $http.put('/api/candidates/expenses/edit', req).success(function (res) {
                    //console.log(res);
                    $http.get('/api/candidates/expenses').success(function (expenses) {
                        $scope.expensesArray[expenseIndex].total = expenses.object[expenseIndex].total;
                        var checked = $scope.expensesArray[expenseIndex].expenses[i].checked;
                        $scope.expensesArray[expenseIndex].expenses[i] = expenses.object[expenseIndex].expenses[i];
                        $scope.expensesArray[expenseIndex].expenses[i].checked = checked;
                        if ($scope.expensesArray[expenseIndex].expenses[i].expenseDetail && $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat) {
                            $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat = $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.vat.slice(0, -1);
                        }
                    });
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
            //console.log(req);
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

        //$scope.logs = function (x, y) {
        //    console.log(x); console.log(y);
        //}

    }]);