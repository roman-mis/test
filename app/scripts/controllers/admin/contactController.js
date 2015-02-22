var app = angular.module('origApp.controllers');

app.controller('contactController',['$scope', '$rootScope', 'CompanyProfileService',
	function($scope, $rootScope, CompanyProfileService){

		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/company_profile/contact', text: 'Company Profile'}
		];

	}]);