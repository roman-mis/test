'use strict';
var app = angular.module('origApp.controllers');

app.controller('contactController',['$scope', '$rootScope',
	function($scope, $rootScope){

		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/companyProfile/contact', text: 'Company Profile'}
		];

	}]);