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
                    console.log('company profile.....');
                    console.log($scope.companyProfile);
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

            modalInstance.result.then(function (data) {
                // save data
                console.log('save ' + data);
                getCompanyProfile();
            }, function (reason) {
                console.log(reason);
            });
        };


        $scope.closeProfileFunction = function () {
            closeProfile.returnValue().dismiss();
        };


        $rootScope.$on('profileSave', function (event, data, tab) {
            console.log('tab getting:' + tab);
            if (tab === 'contact') {
                $scope.companyProfile.contact = data;
            } else if (tab === 'accounts') {
                $scope.companyProfile.accounts = data;
            } else if (tab ==='bankDetails') {
                $scope.companyProfile.bankDetails = data;
            } else if (tab === 'defaults') {
                $scope.companyProfile.defaults = data;
            }
        });

    }]);