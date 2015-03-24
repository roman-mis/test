'use strict';
angular.module('origApp.controllers')
    .controller('expensesRateModalController', [ '$scope', '$modalInstance', 'HttpResource', 'parentScope', 'expensesRateService', 'ConstantsResource',
        function ($scope, $modalInstance, HttpResource, parentScope, expensesRateService, ConstantsResource) {

            var docId;
            $scope.expensesRate = {};

            $scope.expensesRateTypes = ConstantsResource.get('expensesRateTypes')

            if (undefined !== parentScope) {
                docId = parentScope._id;
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

                expensesRateService.saveExpensesRate($scope.expensesRate, docId)
                    .then(function (response) {
                        $scope.isSaving = false;
                        docId ? docId = docId : null;

                        if (!HttpResource.flushError(response)) {
                            $modalInstance.close('saved');
                        }
                    });
            };

        }]);