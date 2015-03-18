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

		// get dropdowns from the server
		CompanyProfileService.getDropDownData().then(function(data){
			$scope.dropDownLists = data;
		});
		
		// get company profile from the server
		CompanyProfileService.getCompanyProfile().then(function(data){
			if(data.companyProfile){
				$scope.companyProfile =data.companyProfile.companyProfile;
				console.log('company profile.....');
				console.log($scope.companyProfile);
			}


		});
		 $scope.isTabActive = function(stateKey) {
            return $state.includes('app.admin.' + stateKey);
          };

		$scope.save = function(val){
		    if(val){
               
               	CompanyProfileService.saveCompanyProfile($scope.companyProfile,'contact');

		    }
		
		
		};

	}]);