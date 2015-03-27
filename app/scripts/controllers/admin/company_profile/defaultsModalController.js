'use strict';
angular.module('origApp.controllers')
    .controller('defaultsModalController', [ '$scope', '$modalInstance', 'parentScope', 'CompanyProfileService',
        function ($scope, $modalInstance, parentScope, CompanyProfileService) {

            $scope.companyProfile = {};

            if (undefined !== parentScope) {
                $scope.companyProfile = parentScope.companyProfile;
                $scope.dropDownLists =  parentScope.dropDownLists;
            }

            $scope.cancel = function () {
                $modalInstance.dismiss('canceled passed to parent');
            };

            $scope.saveDefaults = function () {
                CompanyProfileService.saveCompanyProfile($scope.companyProfile, 'defaults').
                    then(function (response) {

                        if ('saved successfully' === response) {
                            $modalInstance.close('saved');
                        }

                    }, function (error) {
                        console.log('defaultModalController.error', error);
                    });
            };

        }]);