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
            //console.log('getting expenses done !!');
            //console.log(expenses);
            $scope.expensesArray = expenses.object;
            init();
        });

        function init() {

            for (var i = 0; i < $scope.expensesArray.length; i++) {
                $scope.expensesArray[i].startDate = getMonday($scope.expensesArray[i].claimDate);
                $scope.expensesArray[i].categories = [];
                //$scope.expensesArray[i].editFlags = [];
                for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                    $scope.expensesArray[i].expenses[j].checked = false;
                    $scope.expensesArray[i].expenses[j].edit = false;
                    if ($scope.expensesArray[i].expenses[j].expenseDetail && $scope.expensesArray[i].expenses[j].expenseDetail.vat) {
                        $scope.expensesArray[i].expenses[j].expenseDetail.vat = $scope.expensesArray[i].expenses[j].expenseDetail.vat.slice(0, -1);
                    }
                    if ($scope.expensesArray[i].categories.indexOf($scope.expensesArray[i].expenses[j].expenseType) == -1) {
                        $scope.expensesArray[i].categories.push($scope.expensesArray[i].expenses[j].expenseType);
                        //$scope.expensesArray[i].editFlags.push(false);
                    }
                }

            }
            $scope.cloned = [];
            angular.copy($scope.expensesArray, $scope.cloned);
            console.log($scope.expensesArray);
        }

        function getMonday(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        }

        //$scope.startEditing = function (expenseIndex, categoryIndex) {
        //    //console.log(categoryIndex); console.log(expenseIndex);
        //    $scope.expensesArray[expenseIndex].editFlags[categoryIndex] = true;
        //    //console.log($scope.cloned);
        //    //console.log($scope.expensesArray);
        //}

        $scope.finishEditing = function (expenseIndex, itemId, save) {
            //console.log($scope.mealTypes);
            if (save) {
                var req = {};
                req.body = [];
                for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                    if ($scope.expensesArray[expenseIndex].expenses[i]._id === itemId) {
                        angular.copy($scope.cloned[expenseIndex].expenses[i], $scope.expensesArray[expenseIndex].expenses[i]);
                        //console.log($scope.expensesArray[expenseIndex].expenses[i].expenseType);
                        var subType = '';
                        if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == 'Subsistence') {
                            for (var j = 0; j < $scope.mealTypes.length; j++) {
                                //console.log($scope.expensesArray[expenseIndex].expenses[i]);
                                var newSub = $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name;
                                if (newSub == $scope.mealTypes[j].name) {
                                    subType = $scope.mealTypes[j]._id;
                                    break;
                                }
                            }
                        } else if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == 'Other') {
                            for (var j = 0; j < $scope.otherTypes.length; j++) {
                                //console.log($scope.expensesArray[expenseIndex].expenses[i]);
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
                        //console.log(expenses.object[expenseIndex].expenses[i]);
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
                        //console.log('found', itemId);
                        break;
                    }
                }
            }
        }

        $scope.deleteSelected = function (expenseIndex, category) {
            var req = {};
            req.expenseIds = [];
            for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                if ($scope.expensesArray[expenseIndex].expenses[i].checked
                    && $scope.expensesArray[expenseIndex].expenses[i].expenseType == category) {
                    req.expenseIds.push($scope.expensesArray[expenseIndex].expenses[i]._id);
                }
            }
            console.log(req);
            $http.delete('/api/candidates/expenses', req).success(function (res) {
                console.log(res);
                //$http.get('/api/candidates/expenses').success(function (expenses) {
                //    $scope.expensesArray = expenses.object;
                //    init();
                //});
            });
        }

        //$scope.logs = function (x, y) {
        //    console.log(x); console.log(y);
        //}

    }]);