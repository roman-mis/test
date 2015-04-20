'use strict';
angular.module('origApp.controllers')
    .controller('CandidateSidebarAddExp8Controller', function ($scope, HttpResource, ConstantsResource, $modal) {
        $scope.expenseData.others = $scope.expenseData.others || [];
        // $scope.types = ConstantsResource.get('otherexpensetypes');
        $scope.receiptUrlArray = [];
        $scope.types = HttpResource.model('systems/expensesrates/expensesratetype/other').query({});

        $scope.defaultAddData = {};
        $scope.addData = angular.copy($scope.defaultAddData);

        function addItem(data) {
            data.amount = 1;
            data.value = data.cost;
            $scope.expenseData.others.push(data);
            $scope.addData = angular.copy($scope.defaultAddData);
            $scope.receiptUrlArray.push([]);
        }

        $scope.add = function () {
            if ($scope.addData.date === 'all') {
                $scope.addAllDatesData($scope.addData, addItem);
            } else {
                addItem($scope.addData);
            }
        };

        $scope.remove = function (index) {
            $scope.expenseData.others.splice(index, 1);
            $scope.receiptUrlArray.splice(index, 1);
        };

        $scope.ok = function () {
            //if ($scope.isAllDatesEntered($scope.expenseData.others)) {
            $scope.gotoNext();
            //}
        };

        $scope.$watch('expenseData.others.length', function () {
            setTimeout(function () {
                $scope.normalizeTables();
            });
        });


        $(window).on('resize', $scope.normalizeTables);

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
                $scope.expenseData.others[index].receiptUrls = $scope.receiptUrlArray[index];
            }
        }

    });
