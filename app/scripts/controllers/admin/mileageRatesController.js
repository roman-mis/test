'use strict';
angular.module('origApp.controllers')
.controller('MileageRatesController', function($scope, $rootScope) {
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/mileage_rates', text: 'Mileage Rates'}
    ];
});