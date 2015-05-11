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

		function checkDates(newElement) {
			var acceptedDates = true;
			for(var i = 0; i < $scope.statutoryRates[$scope.type].length; i++){

				if(Date.parse(newElement.validFrom) > Date.parse(newElement.validTo)){
					Notification.error({message: 'the Valid From Date Can Not Be After The Valid TO Date', delay: 3000});
					acceptedDates = false;
					break;
				}

				if(Date.parse($scope.statutoryRates[$scope.type][i].validFrom) <= Date.parse(newElement.validFrom) &&
				Date.parse($scope.statutoryRates[$scope.type][i].validTo) >= Date.parse(newElement.validFrom)){
					Notification.error({message: 'the Valid From Date Is Not Accepted', delay: 3000});
				console.log(i);
				console.log($scope.statutoryRates[$scope.type][i]);
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
			return acceptedDates;
		}


		$scope.addNew = function(newElement){
			$scope.loading = true;
			if(checkDates(newElement) === true){
				newElement.notSaved = true;
				$scope.statutoryRates[$scope.type].push(angular.copy(newElement));
				newElement = {};
				// StatutoryRatesService.addToStatutoryRates(newElement, $scope.type)
				// .then(function(res){
				// 	console.log(res);
				// 	$scope.statutoryRates = res.data.object;
				// 	$scope.loading = false;
				// 	Notification.success({message:'Added successfully', delay:2000});
				// },function(){
				// 	$scope.loading = false;
				// });
			}
		};

		$scope.deleteOne = function(validFrom){
			console.log(validFrom);
			for(var i = 0; i < $scope.statutoryRates[$scope.type].length; i++){
				if($scope.statutoryRates[$scope.type][i].validFrom+'' === validFrom+''){
					$scope.statutoryRates[$scope.type].splice(i,1);
				}
			}
		};

		$scope.save = function(){
			console.log($scope.statutoryRates[$scope.type]);
			StatutoryRatesService.saveStatutoryRates($scope.statutoryRates[$scope.type], $scope.type)
			.then(function(res){
				console.log(res);
				$scope.statutoryRates = res.data.object;
				$scope.loading = false;
				Notification.success({message:'Added successfully', delay:2000});
			},function(){
				$scope.loading = false;
			});
		};

		$scope.disableSave = function(){
			var disableSave = true;
			for(var i = 0; i < $scope.statutoryRates[$scope.type].length; i++){
				if($scope.statutoryRates[$scope.type][i].notSaved === true){
					disableSave = false;
				}
			}
			return disableSave;
		};

		$scope.cancel = function(){
			for(var i = 0; i < $scope.statutoryRates[$scope.type].length; i++){
				if($scope.statutoryRates[$scope.type][i].notSaved === true){
					$scope.statutoryRates[$scope.type].splice(i,1);
					i--;
				}
			}
		};

		$scope.saveElement = function(validFrom){
			console.log(validFrom);
			console.log($scope.statutoryRates[$scope.type]);
			var clone = angular.copy($scope.statutoryRates[$scope.type])
			var temp = [];
			for(var i = 0; i < clone.length; i++){
				if(clone[i].validFrom+'' !== validFrom+'' && clone[i].notSaved === true){
					temp.push(clone.splice(i,1)[0]);
					break;
				}
			}
			StatutoryRatesService.saveStatutoryRates(clone, $scope.type)
			.then(function(res){
				console.log(res);
				$scope.statutoryRates = res.data.object;
				console.log(temp)
				for(var i = 0; i < temp.length; i++){
					$scope.statutoryRates[$scope.type].push(temp[i]);
				}
				$scope.loading = false;
				console.log($scope.statutoryRates[$scope.type]);
				Notification.success({message:'Added successfully', delay:2000});
			},function(){
				$scope.loading = false;
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