'use strict';
var app = angular.module('origApp.controllers');

app.controller('contactController',['$scope', '$rootScope', 'ModalService', '$stateParams',
	function($scope, $rootScope, ModalService, $stateParams){

		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/companyProfile/contact', text: 'Company Profile'}
		];

	}]);