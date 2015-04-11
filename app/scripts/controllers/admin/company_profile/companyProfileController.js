'use strict';
var app = angular.module('origApp.controllers');

app.controller('companyProfileController', ['$scope', '$rootScope', 'CompanyProfileService', '$state', 'ModalService', 'closeProfile',
    function ($scope, $rootScope, CompanyProfileService, $state, ModalService, closeProfile) {

        $rootScope.breadcrumbs = [{link: '/', text: 'Home'},
            {link: '/admin/home', text: 'Admin'},
            {link: '/admin/companyProfile/contact', text: 'Company Profile'}];

        $scope.companyProfile = {};
        $scope.tab = 'contact';
        $scope.mapLists = {};

        // get dropdowns from the server
        CompanyProfileService.getDropDownData().then(function (data) {
            $scope.dropDownLists = data;
        });

        getCompanyProfile();

        // get company profile from the server
        function getCompanyProfile() {
            CompanyProfileService.getCompanyProfile().then(function (data) {
                if (data.companyProfile) {
                    $scope.companyProfile = data.companyProfile;
                }

            });
        }

        $scope.isTabActive = function (stateKey) {
            return $state.includes('app.admin.' + stateKey);
        };


        $scope.openModal = function (type) {

            console.log(type);

            $scope.type = type;

            var modalInstance = ModalService.open({
                templateUrl: 'views/admin/companyProfile/partials/' + type + '.html',
                controller: 'companyProfileModalController',
                size: 'md',
                parentScope: $scope
            });

//             modalInstance.result.then(function (data) {
//                 getCompanyProfile();
//             }, function (reason) {
// //                getCompanyProfile();
//             });
        };


        $scope.closeProfileFunction = function () {
            closeProfile.returnValue().dismiss();
        };


    }]);
