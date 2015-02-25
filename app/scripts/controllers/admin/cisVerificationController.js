'use strict';
angular.module('origApp.controllers')
.controller('CISVerificationController', function($scope, $rootScope) {
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/cis_verification', text: 'CISVerification'}
    ];
});