'use strict';

var app = angular.module('origApp.controllers');

app.controller('statutoryRatesController',['$scope', '$rootScope', 'StatutoryRatesService', 'ModalService', 'Notification',
	function($scope, $rootScope, StatutoryRatesService, ModalService,Notification){

		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
		{link: '/admin/home', text: 'Admin'},
		{link: '/admin/statutory_rates', text: 'Statutory rates'}
		];

		$scope.loading = false;
		$scope.statutoryRates = {};
		var docId = null;
		
		// ge statutory rates from the server
		StatutoryRatesService.getStatutoryRates().then(function(data){
			if(data.statutoryRates){
				$scope.statutoryRates = data.statutoryRates;
			}
			console.log($scope.statutoryRates )
			docId = data.id;
		});


		$scope.addNew = function(newElement){
			var acceptedDates = true;
			$scope.loading = true;
			for(var i = 0; i < $scope.statutoryRates[$scope.type].length; i++){
				if(Date.parse($scope.statutoryRates[$scope.type][i].validFrom) <= Date.parse(newElement.validFrom) &&
				Date.parse($scope.statutoryRates[$scope.type][i].validTo) >= Date.parse(newElement.validFrom)){
					Notification.error({message: 'the Valid From Date Is Not Accepted', delay: 3000});
					acceptedDates = false;
					break;
				}

				if(Date.parse($scope.statutoryRates[$scope.type][i].validFrom) <= Date.parse(newElement.validTo) &&
				Date.parse($scope.statutoryRates[$scope.type][i].validTo) >= Date.parse(newElement.validTo	)){
					Notification.error({message: 'the Valid To Date Is Not Accepted', delay: 3000});
					acceptedDates = false;
					break;
				}

				if(Date.parse($scope.statutoryRates[$scope.type][i].validFrom) >= Date.parse(newElement.validFrom) &&
				Date.parse($scope.statutoryRates[$scope.type][i].validTo) <= Date.parse(newElement.validTo	)){
					Notification.error({message: 'The New Period Can Not Contain an Old Period', delay: 3000});
					acceptedDates = false;
					break;
				}
			}
	
			if(acceptedDates === true){
				StatutoryRatesService.addToStatutoryRates(newElement, $scope.type)
				.then(function(res){
					console.log(res);
					$scope.statutoryRates = res.data.object;
					$scope.loading = false;
				},function(){
					$scope.loading = false;
				});
			}
		};

		$scope.deleteOne = function(id){
			StatutoryRatesService.deleteFromStatutoryRates(id,$scope.type)
			.then(function(res){
				console.log(res);
				$scope.statutoryRates = res.data.object;
				$scope.loading = false;
			},function(){

			});
		};

		$scope.openModal = function(type) {
			$scope.type = type;
			var modalInstance = ModalService.open({
				templateUrl: 'views/admin/statutory_rates/partials/' + type + '.html',
				controller: 'statutoryRatesModalController',
				size: 'lg',
				parentScope: $scope
			});

			modalInstance.result.then(function (data) {
				// save data
				console.log(data);
			}, function (reason) {
				console.log(reason);
			});
		};

	}]);