'use strict';
var app = angular.module('origApp.controllers');

app.controller('accountsController',['$scope', '$location', 'ModalService', '$stateParams', 'HttpResource', '$rootScope','$state','CompanyProfileService',
	function($scope, $location, HttpResource, ModalService, $stateParams, $rootScope, $state, CompanyProfileService){
    
		$rootScope.breadcrumbs.splice(3,$rootScope.breadcrumbs.length-1);
    console.log($scope.companyProfile);

		$rootScope.breadcrumbs.push({link: '/admin/home/companyProfile/accounts', text: 'Accounts'})


      $scope.isTabActive = function(stateKey) {
            return $state.includes('app.admin.' + stateKey);
          };

}]);