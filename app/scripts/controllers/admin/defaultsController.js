'use strict';
var app = angular.module('origApp.controllers');

app.controller('defaultsController',['$scope', '$rootScope','$state','CompanyProfileService',
	function($scope, $rootScope,$state, CompanyProfileService){
		$rootScope.breadcrumbs.splice(3,$rootScope.breadcrumbs.length-1);
		$rootScope.breadcrumbs.push(
		{link: '/admin/home/companyProfile/defaults', text: 'Defaults'});


		 $scope.isTabActive = function(stateKey) {
            return $state.includes('app.admin.' + stateKey);
          };

	}
]);