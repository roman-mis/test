'use strict';

angular.module('origApp.controllers')
.controller('MileageController', function($scope, $rootScope){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/mileage', text: 'Mileage Rates'}
    ];   
    $scope.$parent.tab = 'mileage';
});