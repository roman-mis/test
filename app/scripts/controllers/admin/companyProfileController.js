'use strict';
var app = angular.module('origApp.controllers');

app.controller('companyProfileController',['$scope', '$rootScope', 'CompanyProfileService','$state',
	function($scope, $rootScope, CompanyProfileService,$state){
        
		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/companyProfile/contact', text: 'Company Profile'}
		];

		$scope.companyProfile = {};
		$scope.tab = 'contact';
		var docId = null;

		// get dropdowns from the server
		CompanyProfileService.getDropDownData().then(function(data){
			$scope.dropDownLists = data;
		});
		
		// get company profile from the server
		CompanyProfileService.getCompanyProfile().then(function(data){
			if(data.companyProfile){
				$scope.companyProfile =data.companyProfile[0].companyProfile;
			}

			$scope.docId = data.companyProfile[0]._id;
		});
		 $scope.isTabActive = function(stateKey) {
            return $state.includes('app.admin.' + stateKey);
          };

		$scope.save = function(val){
			console.log(val);
			console.log($scope.companyProfile);
			CompanyProfileService.saveCompanyProfile($scope.companyProfile, $scope.docId,'/contact');
		
		};

	}]);