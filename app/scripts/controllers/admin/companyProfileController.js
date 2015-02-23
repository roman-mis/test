var app = angular.module('origApp.controllers');

app.controller('companyProfileController',['$scope', '$rootScope', 'CompanyProfileService',
	function($scope, $rootScope, CompanyProfileService){

		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/company_profile/contact', text: 'Company Profile'}
		];

		$scope.companyProfile = {};
		var docId = null;

		CompanyProfileService.getCompanyProfile().then(function(data){
			$scope.companyProfile = data.companyProfile;
			docId = data._id;
		});

		$scope.save = function(){
			CompanyProfileService.saveCompanyProfile($scope.companyProfile, docId);
		};

	}]);