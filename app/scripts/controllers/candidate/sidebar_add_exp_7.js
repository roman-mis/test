'use strict';
angular.module('origApp.controllers')
    .controller('CandidateSidebarAddExp7Controller', function ($scope, HttpResource, $modal) {
        $scope.expenseData.subsistences = $scope.expenseData.subsistences || [];
        // $scope.mealTypes = ConstantsResource.get('mealslist');
        $scope.mealTypes = HttpResource.model('systems/expensesrates/expensesratetype/subsistence').query({});
        $scope.receiptUrlArray = [];
        console.log($scope.mealTypes);

        $scope.defaultAddData = {};
        $scope.addData = angular.copy($scope.defaultAddData);

        $scope.onTypeChanged = function () {
            $scope.addData.cost = $scope.addData.type ? $scope.addData.type.amount : '0.00';
            $scope.addData.value = $scope.addData.type ? $scope.addData.type.amount : '0.00';
            $scope.addData.amount = 1;
        };


        function addItem(data) {
            $scope.expenseData.subsistences.push(data);
            $scope.receiptUrlArray.push([]);
            $scope.addData = angular.copy($scope.defaultAddData);
        }

        $scope.add = function () {
            if ($scope.addData.date === 'all') {
                $scope.addAllDatesData($scope.addData, addItem);
            } else {
                addItem($scope.addData);
            }
        };

        $scope.remove = function (index) {
            $scope.expenseData.subsistences.splice(index, 1);
            $scope.receiptUrlArray.splice(index, 1);
        };

        $scope.ok = function () {
            //if ($scope.isAllDatesEntered($scope.expenseData.subsistences)) {
            $scope.gotoNext();
            //}
        };

        $scope.$watch('expenseData.subsistences.length', function () {
            setTimeout(function () {
                $scope.normalizeTables();
            });
        });

        $scope.viewReceipt = function (index) {
            //logs(expense.receiptUrls, 'URLs');
            var modalInstance = $modal.open({
                templateUrl: 'views/candidate/expenseReceipt.html',
                controller: 'expenseReceiptManualCtrl',
                size: 'md',
                resolve: {
                    rootScope: function () {
                        return $scope;
                    },
                    index: function () {
                        return index;
                    }
                }
            });

            modalInstance.result.then(function () {
                saveAnyway();
            }, function (msg) {
                saveAnyway();
            });
            function saveAnyway() {
                $scope.expenseData.subsistences[index].receiptUrls = $scope.receiptUrlArray[index];
            }
        }

    });
