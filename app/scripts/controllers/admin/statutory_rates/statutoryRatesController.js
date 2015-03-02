'use strict';

var app = angular.module('origApp.controllers');

app.controller('statutoryRatesController',['$scope', '$rootScope', 'StatutoryRatesService', 'ModalService',
	function($scope, $rootScope, StatutoryRatesService, ModalService){

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

		$scope.openModal = function(type) {
			console.log(type)
			var modalInstance = ModalService.open({
				templateUrl: 'views/admin/statutory_rates/partials/' + type + '.html',
				controller: 'statutoryRatesModalController',
				size: 'lg',
				parentScope: $scope.statutoryRates[type]
			});

			modalInstance.result.then(function (data) {
				// save data
				console.log(data);
			}, function (reason) {
				console.log(reason);
			});
		};

	}]);