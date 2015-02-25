'use strict';
angular.module('origApp.controllers')
.controller('RTIController', function($scope, $rootScope) {
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/rti', text: 'RTI'}
    ];
});