'use strict';
angular.module('origApp.controllers')
    .controller('bankDetailsModalController', [ '$scope', '$modalInstance', 'parentScope', 'CompanyProfileService',
        function ($scope, $modalInstance, parentScope, CompanyProfileService) {

            $scope.companyProfile = {};

            console.log(parentScope);

            if (undefined !== parentScope) {
                $scope.companyProfile = parentScope.companyProfile;
            }

            $scope.cancel = function () {
                $modalInstance.dismiss('canceled passed to parent');
            };

            $scope.saveBankDetails = function () {
                CompanyProfileService.saveCompanyProfile($scope.companyProfile, 'bankDetails').
                    then(function (response) {

                        if ('saved successfully' === response) {
                            $modalInstance.close('saved');
                        }

                    }, function (error) {
                        console.log('bankDetailsModalController.error', error);
                    });
            };

        }]);