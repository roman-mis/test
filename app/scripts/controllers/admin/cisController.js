'use strict';

angular.module('origApp.controllers')
.controller('CisController', function($scope, $rootScope,HttpResource){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/cis', text: 'CIS Verification'}
    ];   
    $scope.$parent.tab = 'cis';
    
    HttpResource.model('/api/systems/cisverification').customGet('',{},function(data){
    		console.log('cis');
    		console.log(data);
    });
});