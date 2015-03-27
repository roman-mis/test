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
                var req = {};
                req.body = [];
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
                for (var i = 0; i < $scope.expensesArray[expenseIndex].expenses.length; i++) {
                    if ($scope.expensesArray[expenseIndex].expenses[i]._id === itemId) {
                        angular.copy($scope.cloned[expenseIndex].expenses[i], $scope.expensesArray[expenseIndex].expenses[i]);
                        console.log($scope.expensesArray[expenseIndex].expenses[i].expenseType);
                        req.body.push({
                            expenseType:  $scope.expensesArray[expenseIndex].expenses[i].expenseType,
                            subType:      $scope.expensesArray[expenseIndex].expenses[i].expenseDetail.name,
                            date:         $scope.expensesArray[expenseIndex].expenses[i].date,
                            value:        $scope.expensesArray[expenseIndex].expenses[i].amount,
                            id:           $scope.expensesArray[expenseIndex].expenses[i]._id,
                            receiptUrls:  $scope.expensesArray[expenseIndex].expenses[i].receiptUrls,
                            status:       $scope.expensesArray[expenseIndex].expenses[i].status
                        });
                        break;
                    }
                }
                console.log(req);
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

        //initialize();


        function initialize() {
            $scope.data = [
                          {
                              "_id": "5506fd4fba11c59b8f2ef465",
                              "id": 4,
                              "category": "Organic",
                              "type": "Quordate",
                              "date": "dd/mm/yy",
                              "value": 732,
                              "amount": 219,
                              "vat": 386,
                              "total": 869,
                              "status": "Submitted"
                          },
                          {
                              "_id": "5506fd4f377de3c1ad043496",
                              "id": 261,
                              "category": "Plastic",
                              "type": "Conjurica",
                              "date": "dd/mm/yy",
                              "value": 828,
                              "amount": 964,
                              "vat": 361,
                              "total": 806,
                              "status": "Submitted"
                          },
                          {
                              "_id": "5506fd4fb1a4ef293f876905",
                              "id": 886,
                              "category": "Plastic",
                              "type": "Comvoy",
                              "date": "dd/mm/yy",
                              "value": 748,
                              "amount": 730,
                              "vat": 653,
                              "total": 640,
                              "status": "Unsubmitted"
                          },
                          {
                              "_id": "5506fd4f7ee42b540862d9bd",
                              "id": 646,
                              "category": "Plastic",
                              "type": "Equitax",
                              "date": "dd/mm/yy",
                              "value": 769,
                              "amount": 76,
                              "vat": 782,
                              "total": 566,
                              "status": "Submitted"
                          },
                          {
                              "_id": "5506fd4f6ea68ce28c3c38fe",
                              "id": 591,
                              "category": "Organic",
                              "type": "Visalia",
                              "date": "dd/mm/yy",
                              "value": 979,
                              "amount": 10,
                              "vat": 244,
                              "total": 277,
                              "status": "Submitted"
                          },
                          {
                              "_id": "5506fd4f30eb7d32bd680e43",
                              "id": 470,
                              "category": "Organic",
                              "type": "Envire",
                              "date": "dd/mm/yy",
                              "value": 412,
                              "amount": 832,
                              "vat": 440,
                              "total": 76,
                              "status": "Submitted"
                          },
                          {
                              "_id": "5506fd4f799c024b34bb1461",
                              "id": 473,
                              "category": "Other",
                              "type": "Marqet",
                              "date": "dd/mm/yy",
                              "value": 173,
                              "amount": 343,
                              "vat": 951,
                              "total": 998,
                              "status": "Unsubmitted"
                          },
                          {
                              "_id": "5506fd4fe63464f5fa7dcd74",
                              "id": 979,
                              "category": "Other",
                              "type": "Maineland",
                              "date": "dd/mm/yy",
                              "value": 716,
                              "amount": 562,
                              "vat": 744,
                              "total": 861,
                              "status": "Submitted"
                          },
                          {
                              "_id": "5506fd4f696009cfb2a9b13a",
                              "id": 57,
                              "category": "Organic",
                              "type": "Extragene",
                              "date": "dd/mm/yy",
                              "value": 272,
                              "amount": 59,
                              "vat": 668,
                              "total": 672,
                              "status": "Unsubmitted"
                          }
            ];

        }

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