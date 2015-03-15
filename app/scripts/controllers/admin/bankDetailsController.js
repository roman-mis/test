'use strict';
var app = angular.module('origApp.controllers');

app.controller('bankDetailsController',['$scope', '$location', 'HttpResource', '$rootScope','$state',
	function($scope, $location, HttpResource, $rootScope,$state){
	$rootScope.breadcrumbs.splice(3,$rootScope.breadcrumbs.length-1);

    $rootScope.breadcrumbs.push({link: '/admin/company_profile/bank_details', text: 'Bank Details'});
        $scope.isTabActive = function(stateKey) {
            return $state.includes('app.admin.' + stateKey);
          };
     $scope.save=function(val){

       	if(val){
          console.log('valid inputs');

       	}else{

       		$scope.submitted=true;
       	}
       }
}]);