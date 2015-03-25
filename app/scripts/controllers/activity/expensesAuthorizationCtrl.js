'use strict';
var app = angular.module('origApp.controllers');

app.controller("expensesAuthorizationCtrl",
    ['$scope', '$http', '$rootScope', 'HttpResource',
    function ($scope, $http, $rootScope, HttpResource) {

        $rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
                                  { link: '/activity/home', text: 'Activity' },
                                  { link: '/activity/expensesAuthorization', text: 'Expenses' }
        ];


        HttpResource.model('candidates/expenses').query({}, function (expenses) {
            console.log('getting expenses done !!');
            //console.log(expenses.data);
            $scope.expensesArray = expenses.data.object;
            for (var i = 0; i < $scope.expensesArray.length; i++) {
                $scope.expensesArray[i].categories = [];
                for (var j = 0; j < $scope.expensesArray[i].expenses.length; j++) {
                    if ($scope.expensesArray[i].categories.indexOf($scope.expensesArray[i].expenses[j].expenseType) == -1) {
                        $scope.expensesArray[i].categories.push($scope.expensesArray[i].expenses[j].expenseType);
                    }
                }

            }
            console.log($scope.expensesArray);

            //HttpResource.model('candidates/' + '55100de8e36c36073a376569' + '/contactdetail').query({}, function (res) {
            //    console.log(res);
            //});
        });


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

        $scope.editSelected = function (location) {
            console.log($scope.checked[location.user][location.cat]);
            $scope.editing[location.user] = {};
            $scope.editing[location.user][location.cat] = $scope.checked[location.user][location.cat];
            console.log($scope.editing);
            //for (var i = 0; i < $scope.checked[location.user][location.cat].length; i++) {
            //    $scope.editing[location.user][location.cat][i]= 
            //}
        }

    }]);