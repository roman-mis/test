'use strict';
var app = angular.module('origApp.controllers');

app.controller('bankDetailsController',['$scope', '$location', 'HttpResource', '$rootScope','$state','CompanyProfileService',
	function($scope, $location, HttpResource, $rootScope,$state,CompanyProfileService){
	$rootScope.breadcrumbs.splice(3,$rootScope.breadcrumbs.length-1);

    $rootScope.breadcrumbs.push({link: '/admin/company_profile/bank_details', text: 'Bank Details'});


        $scope.isTabActive = function(stateKey) {
            return $state.includes('app.admin.' + stateKey);
          };


     $scope.save=function(val){
       	if(val){
         CompanyProfileService.saveCompanyProfile($scope.companyProfile, $scope.docId,'/bankDetails');
       	}else{
       		$scope.submitted=true;
       	}
       }
}]);