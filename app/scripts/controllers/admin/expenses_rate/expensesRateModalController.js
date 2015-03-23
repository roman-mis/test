'use strict';
angular.module('origApp.controllers')
    .controller('expensesRateModalController', [ '$scope', '$modalInstance', 'HttpResource', 'parentScope', 'expensesRateService',
        function ($scope, $modalInstance, HttpResource, parentScope, expensesRateService) {

            $scope.expensesRate = {};

            expensesRateService.getExpensesRateTypes().then(function (response) {
                $scope.expensesRateTypes = response;
            });

            if (undefined !== parentScope) {
                $scope.expensesRate = parentScope;
            }

            $scope.cancel = function () {
                $modalInstance.dismiss('canceled passed to parent');
            };

            $scope.save = function ($valid) {
                if (!$valid) {
                    $scope.submitted = true;
                    return;
                }
                $scope.isSaving = true;

                expensesRateService.saveExpensesRate($scope.expensesRate)
                    .then(function (response) {
                        $scope.isSaving = false;
                        if (!HttpResource.flushError(response)) {
                            $modalInstance.close('saved');
                        }
                    });
            };

        }]);