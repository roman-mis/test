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
                putAccessories();
            });
        };
        $scope.loadAllData();

        function putAccessories() {
            $scope.majorCheck = false;
            $scope.allData.forEach(function (claim) {
                claim.claimCheck = false;
            });
        }

        $scope.g = function (d) {
            console.log(d)
            return d;
        };

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

        $scope.majorCheckChange = function () {
            $scope.allData.forEach(function (claim) {
                claim.claimCheck = $scope.majorCheck;
            });
        }

        $scope.inverseSelection = function () {
            $scope.majorCheck = false;
            $scope.allData.forEach(function (claim) {
                if (claim.claimCheck) claim.claimCheck = false;
                else claim.claimCheck = true;
            });
        }

        function logs(record, label) {
            if (label) console.log(label + ':', record);
            else console.log(record);
        }
    }]);
