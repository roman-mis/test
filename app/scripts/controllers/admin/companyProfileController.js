var app = angular.module('origApp.controllers');

app.controller('companyProfileController',['$scope', '$rootScope', 'CompanyProfileService', 'HttpResource',
	function($scope, $rootScope, CompanyProfileService, HttpResource){

		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/company_profile/contact', text: 'Company Profile'}
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
			if(data.companyProfile)
				$scope.companyProfile = data.companyProfile;
			docId = data._id;
		});

		$scope.save = function(){
			CompanyProfileService.saveCompanyProfile($scope.companyProfile, docId);
		};

	}]);