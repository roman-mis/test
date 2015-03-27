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
            //console.log(expenseIndex);
            if (save) {
                //$scope.expensesArray[expenseIndex].editFlags[categoryIndex] = false;
                //for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                //    if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == $scope.expensesArray[expenseIndex].categories[categoryIndex]) {
                //        $scope.expensesArray[expenseIndex].expenses[i].edit = false;
                //        angular.copy($scope.cloned[expenseIndex].expenses[i], $scope.expensesArray[expenseIndex].expenses[i]);
                //        req.body.push({
                //            "expenseType": $scope.expensesArray[expenseIndex].expenses[i].expenseType,
                //            "subType": $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name,
                //            "value": $scope.expensesArray[expenseIndex].expenses[i].amount,
                //            "id": $scope.expensesArray[expenseIndex].expenses[i]._id,
                //            "receiptUrls": $scope.expensesArray[expenseIndex].expenses[i].receiptUrls
                //        });
                //    }
                //}
                var req = {};
                req.body = [];
                for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                    if ($scope.expensesArray[expenseIndex].expenses[i]._id === itemId) {
                        angular.copy($scope.cloned[expenseIndex].expenses[i], $scope.expensesArray[expenseIndex].expenses[i]);
                        console.log($scope.expensesArray[expenseIndex].expenses[i].expenseType);
                        req.body.push({
                            "expenseType": $scope.expensesArray[expenseIndex].expenses[i].expenseType,
                            "subType": $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name,
                            "date": $scope.expensesArray[expenseIndex].expenses[i].date,
                            "value": $scope.expensesArray[expenseIndex].expenses[i].amount,
                            "id": $scope.expensesArray[expenseIndex].expenses[i]._id,
                            "receiptUrls": $scope.expensesArray[expenseIndex].expenses[i].receiptUrls
                        });
                        break;
                    }
                }
                $http.put('/api/candidates/expenses/edit', req).success(function (res) {
                    console.log(res);
                    $http.get('/api/candidates/expenses').success(function (expenses) {
                        //console.log('getting expenses done !!');
                        //console.log(expenses);
                        $scope.expensesArray = expenses.object;
                        init();
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
                //$scope.expensesArray[expenseIndex].editFlags[categoryIndex] = false;
                //for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                //    if ($scope.expensesArray[expenseIndex].expenses[i].expenseType == $scope.expensesArray[expenseIndex].categories[categoryIndex]) {
                //        $scope.expensesArray[expenseIndex].expenses[i].edit = false;
                //        angular.copy($scope.expensesArray[expenseIndex].expenses[i], $scope.cloned[expenseIndex].expenses[i]);
                //    }
                //}
            }
        }

        //$scope.logs = function (x, y) {
        //    console.log(x); console.log(y);
        //}

        //var catCount;

        //// counting categories and items/category
        //$scope.categories = [];
        //catCount = [];
        //for (var i = 0; i < $scope.data.length; i++) {
        //    if ($scope.categories.indexOf($scope.data[i].category) == -1) {
        //        $scope.categories.push($scope.data[i].category);
        //        catCount.push(1);
        //    } else catCount[$scope.categories.indexOf($scope.data[i].category)]++;
        //}

        //$scope.users = ['first', 'second'];
        //$scope.editing = {};
        //$scope.checked = {};

        //$scope.editSelected = function (location) {
        //    console.log($scope.checked[location.user][location.cat]);
        //    $scope.editing[location.user] = {};
        //    $scope.editing[location.user][location.cat] = $scope.checked[location.user][location.cat];
        //    console.log($scope.editing);
        //    //for (var i = 0; i < $scope.checked[location.user][location.cat].length; i++) {
        //    //    $scope.editing[location.user][location.cat][i]= 
        //    //}
        //}

    }]);