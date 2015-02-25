'use strict';
angular.module('origApp.controllers')
.controller('PaymentRateController', function($scope, $rootScope) {
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/payment_rate', text: 'Payment Rate'}
    ];
});