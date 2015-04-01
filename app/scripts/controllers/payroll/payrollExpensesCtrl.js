'use strict';
var app = angular.module('origApp.controllers');
app.controller('payrollExpensesCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
                                  { link: '/payroll/home', text: 'Payroll' },
                                  { link: '/payroll/expenses', text: 'Expenses' }
        ];

        $http.get('/api/constants/fuels').success(function (res) {
            $scope.fuels = res;
        });

        $scope.loadAllData = function () {
            $http.get('/api/candidates/expenses/approvedOnly').success(function (expenses) {
                logs(expenses, 'Claims and system');
                $scope.allData = expenses.object.claims;
                logs($scope.allData, 'All Claims');

                $scope.system = expenses.object.system[0];
                $scope.system.statutoryTables.vat.forEach(function (time) {
                    var validFrom = new Date(time.validFrom);
                    var validTo = new Date(time.validTo);
                    var current = new Date();
                    if (current.valueOf() >= validFrom.valueOf() && current.valueOf() <= validTo.valueOf()) {
                        $scope.globalVat = time.amount / 100;
                    }
                });

                putExtras();
            });
        };
        $scope.loadAllData();

        function putExtras() {
            $scope.allData.forEach(function (claim) {
                claim.claimCheck = false;
                claim.startDate = getMonday(claim.claimDate);

                //claim.show = true;
                claim.total = 0;
                claim.categories = [];

                claim.expenses.forEach(function (expense) {
                    //if (expense.status != 'approved') {
                    //    claim.show = false;
                    //}
                    // initializing vat
                    expense.expenseDetail.vat = 0;
                    // calculating vat for Subsistence and Other
                    $scope.system.expensesRate.forEach(function (doc) {
                        if (expense.expenseDetail.id == doc._id) {
                            if (doc.taxApplicable) {
                                expense.expenseDetail.vat =
                                    expense.value * $scope.globalVat;
                            } else {
                                expense.expenseDetail.vat = 0;
                            }
                        }
                    });

                    // calculating vat for Transport
                    if (expense.expenseType == 'Transport'
                        && expense.subType == 'Car / Van') {
                        var fuelType = claim.user.worker.vehicleInformation[0].fuelType;
                        var engineSize = claim.user.worker.vehicleInformation[0].engineSize;
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
                            expense.expenseDetail.vat =
                                $scope.system.mileageRates.petrolUpTo1400 * $scope.globalVat;
                        } else if (piece.fuelCode == '2' && piece.engineCode == '1') {
                            expense.expenseDetail.vat =
                                $scope.system.mileageRates.dieselUpTo1600 * $scope.globalVat;
                        } else if (piece.fuelCode == '3' && piece.engineCode == '1') {
                            expense.expenseDetail.vat =
                                $scope.system.mileageRates.lpgUpTo1400 * $scope.globalVat;
                        }
                    }

                    // calculating total based on vat, amount and value
                    expense.expenseDetail.total = 0;
                    expense.expenseDetail.total +=
                        expense.amount * expense.value ? expense.amount * expense.value : 0;
                    expense.expenseDetail.total +=
                        expense.amount * expense.expenseDetail.vat ? expense.amount * expense.expenseDetail.vat : 0;
                    claim.total += expense.expenseDetail.total;

                    if (claim.categories.indexOf(expense.expenseType) == -1) {
                        claim.categories.push(expense.expenseType);
                    }
                });

                //if (claim.expenses.length == 0) claim.show = false;
            });
        }

        function getMonday(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        }

        $scope.selectAll = function () {
            $scope.allData.forEach(function (claim) {
                //if (claim.show)
                claim.claimCheck = true;
            });
        }

        $scope.inverseSelection = function () {
            $scope.allData.forEach(function (claim) {
                //if (claim.show) {
                if (claim.claimCheck) claim.claimCheck = false;
                else claim.claimCheck = true;
                //}
            });
        }

        $scope.setSubmitted = function (claimId) {
            var req = [claimId];
            logs(req, 'set submitted to claim');
            $http.post('/api/candidates/expenses/setClaimsSubmitted', req).success(function (res) {
                logs(res, 'response');
                if (res.result) {
                    $scope.allData.forEach(function (claim, i) {
                        if (claim.id == claimId) {
                            $scope.allData.splice(i, 1);
                        }
                    });
                }
            });
        }

        $scope.batchSetSubmitted = function () {
            var req = [];
            $scope.allData.forEach(function (claim) {
                if (claim.claimCheck) {
                    req.push(claim.id);
                }
            });
            if (req.length == 0) window.alert('No claims selected');
            else {
                logs(req, 'batch set submitted to claims');
                $http.post('/api/candidates/expenses/setClaimsSubmitted', req).success(function (res) {
                    logs(res, 'response');
                    if (res.result) {
                        req.forEach(function (id) {
                            $scope.allData.forEach(function (claim, i) {
                                if (claim.id == id) {
                                    $scope.allData.splice(i, 1);
                                }
                            });
                        });
                    }
                });
            }
        }

        function logs(record, label) {
            if (label) console.log(label + ':', record);
            else console.log(record);
        }
    }]);
