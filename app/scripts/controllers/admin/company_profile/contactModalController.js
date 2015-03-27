'use strict';
angular.module('origApp.controllers')
    .controller('contactModalController', [ '$scope', '$modalInstance', 'parentScope', 'CompanyProfileService',
        function ($scope, $modalInstance, parentScope, CompanyProfileService) {

            $scope.companyProfile = {};

            if (undefined !== parentScope) {
                $scope.companyProfile = parentScope.companyProfile;
            }

            $scope.cancel = function () {
                $modalInstance.dismiss('canceled passed to parent');
            };

            $scope.saveContact = function () {
                CompanyProfileService.saveCompanyProfile($scope.companyProfile, 'contact').
                    then(function (response) {

                        if ('saved successfully' === response) {
                            $modalInstance.close('saved');
                        }

                    }, function (error) {
                        console.log('contactModalController.error', error);
                    });
            };

        }]);