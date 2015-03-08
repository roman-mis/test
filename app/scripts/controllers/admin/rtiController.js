'use strict';

angular.module('origApp.controllers')
.controller('RtiController', function($scope, $rootScope,HttpResource){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/rti', text: 'RTI Submissions'}
    ];
    $scope.$parent.tab = 'rti';

    HttpResource.model('/api/systems/rti').customGet('',{},function(data){
    		console.log('rti');
    		console.log(data);
    });
});