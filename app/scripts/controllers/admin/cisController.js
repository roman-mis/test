'use strict';

angular.module('origApp.controllers')
.controller('CisController', function($scope, $rootScope){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/cis', text: 'CIS Verification'}
    ];   
    $scope.$parent.tab = 'cis';
});