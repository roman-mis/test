'use strict';
angular.module('origApp.controllers')
    .controller('paymentRatesModalController', [ '$scope', '$modalInstance', 'HttpResource', 'parentScope', 'paymentRatesService',
        function ($scope, $modalInstance, HttpResource, parentScope, paymentRatesService) {

            var docId;
            $scope.paymentRates = {};
            /*
             * importAliases in the form is rendered in loop so for the importAliases field to display in init first
             * element is pushed as empty
             *
             * */
            $scope.paymentRates.importAliases = [''];

            if (undefined !== parentScope) {
                docId = parentScope._id;
                $scope.paymentRates = parentScope;
                /*
                * pushing first element as empty to importAliases array so that user can add
                * new aliases even in edit screen
                * */
                $scope.paymentRates.importAliases.unshift('');
            }

            /**
             * @todo Take json list from server
             *
             */
            $scope.rateTypes = ['Hourly', 'Day', 'Expense', 'Holiday'];

            $scope.ok = function () {
                $modalInstance.close('ok passed to parent');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('canceled passed to parent');
            };

            $scope.change = function (elem) {
                var $index;
                $index = $scope.paymentRates.importAliases.indexOf(elem, 1);
                if (elem === '' && $index) {
                    $scope.paymentRates.importAliases.splice($index, 1);
                }
            };

            $scope.save = function ($valid) {
                if (!$valid) {
                    $scope.submitted = true;
                    return;
                }
                $scope.isSaving = true;
                docId ? docId = docId : null;
                /*Removes first empty element in importAliases before posting it to server*/
                if ($scope.paymentRates.importAliases[0] === '') {
                    $scope.paymentRates.importAliases.splice(0, 1);
                }

                paymentRatesService.savePaymentRates($scope.paymentRates, docId)
                    .then(function (response) {
                        $scope.isSaving = false;
                        if (!HttpResource.flushError(response)) {
                            $modalInstance.close('saved');
                        }
                    });
            };

        }]);