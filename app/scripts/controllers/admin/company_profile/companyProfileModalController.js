'use strict';
angular.module('origApp.controllers')
    .controller('companyProfileModalController', [ '$scope', '$modalInstance', 'parentScope', 'CompanyProfileService',
        function ($scope, $modalInstance, parentScope, CompanyProfileService) {

            $scope.companyProfile = {};
            var mapCompanyProfile = {};

            if (undefined !== parentScope) {
                $scope.companyProfile = JSON.parse(JSON.stringify(parentScope.companyProfile));
                $scope.dropDownLists =  parentScope.dropDownLists;


                /*
                 * Copies $scope.companyProfile and maps to mapCompanyProfile and replaces
                 * mapCompanyProfile.defaults[item] with $scope.companyProfile.defaults[item].code
                 * before sending it to server
                 * */
                angular.copy($scope.companyProfile, mapCompanyProfile);

                var objDefaults = Object.keys(mapCompanyProfile.defaults);

                objDefaults.forEach(function (item) {
                    if ($scope.companyProfile.defaults[item].code) {
                        $scope.companyProfile.defaults[item] = mapCompanyProfile.defaults[item].code;
                    }
                });

            }

            $scope.cancel = function () {
                $modalInstance.dismiss('canceled passed to parent');
            };

            function getParams(type) {

                var controller;
                switch (type) {

                case '_edit_accounts':
                    controller = 'accounts';
                    break;
                case '_edit_bankDetails':
                    controller = 'bankDetails';
                    break;
                case '_edit_defaults':
                    controller = 'defaults';
                    break;
                default:
                    controller = 'contact';
                }

                return controller;
            }

            $scope.saveCompanyProfile = function (param) {

                $scope.isSaving = true;

                CompanyProfileService.saveCompanyProfile($scope.companyProfile, param).
                    then(function (response) {

                        $scope.isSaving = false;

                        if ('saved successfully' === response) {
                            $modalInstance.close('saved');
                        }

                    }, function (error) {
                        console.log('contactModalController.error', error);
                    });
            };

        }]);