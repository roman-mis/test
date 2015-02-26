'use strict';

var app = angular.module('origApp.controllers');

app.controller('statutoryRatesController',['$scope', '$rootScope', 'StatutoryRatesService',
	function($scope, $rootScope, StatutoryRatesService){

		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/statutory_rates', text: 'Statutory rates'}
		];

		$scope.statutoryRates = {};
		var docId = null;
		
		// ge statutory rates from the server
		StatutoryRatesService.getStatutoryRates().then(function(data){
			if(data.statutoryRates)
				$scope.statutoryRates = data.statutoryRates;
			docId = data.id;
			console.log(docId, $scope.statutoryRates);
		});
		
	}]);