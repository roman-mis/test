'use strict';
var app = angular.module('origApp.controllers');

app.controller('contactController',['$scope', '$rootScope',
	function($scope, $rootScope){

		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/company_profile/contact', text: 'Company Profile'}
		];

	}]);