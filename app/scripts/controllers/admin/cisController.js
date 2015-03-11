'use strict';

angular.module('origApp.controllers')
.controller('CisController', function($scope, $rootScope,HttpResource, allUsers){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/cis', text: 'CIS Verification'}
    ];   
    $scope.$parent.tab = 'cis';
		console.log('cis');
    console.log(allUsers.details);

    // HttpResource.model('/api/systems/cisverification').customGet('',{},function(data){
    // 		console.log(data);
    // });
});