'use strict';
var app = angular.module('origApp.controllers');
app.controller('payrollExpensesCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
                                  { link: '/payroll/home', text: 'Payroll' },
                                  { link: '/payroll/expenses', text: 'Expenses' }
        ];

        $scope.loadAllData = function () {
            $http.get('/api/candidates/expenses').success(function (expenses) {
                logs(expenses, 'Claims and system');
                $scope.allData = expenses.object.claims;
                logs($scope.allData, 'All Claims');
                putExtras();
            });
        };
        $scope.loadAllData();

        function putExtras() {
            $scope.allData.forEach(function (claim) {
                claim.claimCheck = false;
                claim.startDate = getMonday(claim.claimDate);
                claim.show = true;
                claim.expenses.forEach(function (expense) {
                    if (expense.status != 'approved') {
                        claim.show = false;
                    }
                });
                if (claim.expenses.length == 0) claim.show = false;

                claim.categories = [];
                claim.expenses.forEach(function (expense) {
                    if (claim.categories.indexOf(expense.expenseType) == -1) {
                        claim.categories.push(expense.expenseType);
                    }
                });
            });
        }

        function getMonday(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        }

        Date.prototype.getWeek = function () {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        };

        $scope.getWeek = function (d) {
            // console.log(d);
            var t = (new Date(d)).getWeek();
            //console.log(t);
            return t;
        };

        $scope.selectAll = function () {
            $scope.allData.forEach(function (claim) {
                if(claim.show) claim.claimCheck = true;
            });
        }

        $scope.inverseSelection = function () {
            $scope.allData.forEach(function (claim) {
                if (claim.show) {
                    if (claim.claimCheck) claim.claimCheck = false;
                    else claim.claimCheck = true;
                }
            });
        }

        $scope.setSubmitted = function (claimId) {
            var batchIds = [claimId];
            logs(batchIds, 'set submitted to claim');

        }

        $scope.batchSetSubmitted = function () {
            var batchIds = [];
            $scope.allData.forEach(function (claim) {
                if (claim.claimCheck) {
                    batchIds.push(claim.id);
                }
            });
            if (batchIds.length == 0) window.alert('No claims selected');
            else {
                logs(batchIds, 'batch set submitted to claims');

            }
        }

        function logs(record, label) {
            if (label) console.log(label + ':', record);
            else console.log(record);
        }
    }]);
