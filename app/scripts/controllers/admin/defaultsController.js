'use strict';
var app = angular.module('origApp.controllers');

app.controller('defaultsController',['$scope', '$rootScope','$state',
	function($scope, $rootScope,$state){
		$rootScope.breadcrumbs.splice(3,$rootScope.breadcrumbs.length-1);
		$rootScope.breadcrumbs.push(
		{link: '/admin/home/company_profile/defaults', text: 'Defaults'});
		 $scope.isTabActive = function(stateKey) {
            return $state.includes('app.admin.' + stateKey);
          };
	}]);