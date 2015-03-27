'use strict';
angular.module('origApp.controllers')
    .controller('accountsModalController', [ '$scope', '$modalInstance', 'parentScope', 'CompanyProfileService',
        function ($scope, $modalInstance, parentScope, CompanyProfileService) {

            $scope.companyProfile = {};

            console.log(parentScope);

            if (undefined !== parentScope) {
                $scope.companyProfile = parentScope.companyProfile;
            }

            $scope.cancel = function () {
                $modalInstance.dismiss('canceled passed to parent');
            };

            $scope.saveAccounts = function () {
                CompanyProfileService.saveCompanyProfile($scope.companyProfile, 'accounts').
                    then(function (response) {

                        if ('saved successfully' === response) {
                            $modalInstance.close('saved');
                        }

                    }, function (error) {
                        console.log('contactModalController.error', error);
                    });
            };

        }]);