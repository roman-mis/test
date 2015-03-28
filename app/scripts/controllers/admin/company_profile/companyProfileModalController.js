'use strict';
angular.module('origApp.controllers')
    .controller('contactModalController', [ '$scope', '$modalInstance', 'parentScope', 'CompanyProfileService',
        function ($scope, $modalInstance, parentScope, CompanyProfileService) {

            $scope.companyProfile = {};

            if (undefined !== parentScope) {
                $scope.companyProfile = parentScope.companyProfile;
                $scope.dropDownLists =  parentScope.dropDownLists;
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

                console.log(param);

                CompanyProfileService.saveCompanyProfile($scope.companyProfile, param).
                    then(function (response) {

                        if ('saved successfully' === response) {
                            $modalInstance.close('saved');
                        }

                    }, function (error) {
                        console.log('contactModalController.error', error);
                    });
            };

        }]);