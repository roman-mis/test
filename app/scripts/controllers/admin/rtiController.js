'use strict';

angular.module('origApp.controllers')
.controller('RtiController', function($scope, $rootScope){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/rti', text: 'RTI Submissions'}
    ];
    $scope.$parent.tab = 'rti';
});