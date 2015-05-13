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
		$scope.newElement = {};
		var docId = null;
		$scope.ageRanges =
		[
			{
				id:0,
				description:'21 and over',
				ageLower:21,
				ageUpper:1000
			},
			{
				id:1,
				description:'18 - 20',
				ageLower:18,
				ageUpper:20
			},
			{
				id:2,
				description:'Under 18',
				ageLower:0,
				ageUpper:18
			}
		];
		
		
		// ge statutory rates from the server
		StatutoryRatesService.getStatutoryRates().then(function(data){
			if(data.statutoryRates){
				$scope.statutoryRates = data.statutoryRates;
			}
			console.log($scope.statutoryRates );
			$scope.getCurrentForAll();
			docId = data.id;
		});

		$scope.selectRange = function(id){
			console.log(id);
			for(var i = 0; i < $scope.ageRanges.length; i++){
				
			console.log($scope.ageRanges[i].id);
				if($scope.ageRanges[i].id === id){
					$scope.newElement.ageLower = $scope.ageRanges[i].ageLower;
					$scope.newElement.ageUpper = $scope.ageRanges[id].ageUpper;
				}
			}
		};
		function checkDates(newElement) {
			var acceptedDates = true;
			if(!newElement.amount){
				Notification.error({message: 'Please Enter The Amount Value', delay: 3000});
				return false;
			}

			if(Number(newElement.amount) < 0){
				Notification.error({message: 'Amount Must Be Positive', delay: 3000});
				return false;
			}

			for(var i = 0; i < $scope.statutoryRates[$scope.type].length; i++){
				if( $scope.statutoryRates[$scope.type][i].status === 'delete'){
					continue;
				}

				if(Date.parse(newElement.validFrom) > Date.parse(newElement.validTo)){
					Notification.error({message: 'Start date cannot be after the end date', delay: 3000});
					acceptedDates = false;
					break;
				}

				if(Date.parse($scope.statutoryRates[$scope.type][i].validFrom) <= Date.parse(newElement.validFrom) &&
				Date.parse($scope.statutoryRates[$scope.type][i].validTo) >= Date.parse(newElement.validFrom)){
					Notification.error({message: 'Start date not valid', delay: 3000});
					acceptedDates = false;
					break;
				}

				if(Date.parse($scope.statutoryRates[$scope.type][i].validFrom) <= Date.parse(newElement.validTo) &&
				Date.parse($scope.statutoryRates[$scope.type][i].validTo) >= Date.parse(newElement.validTo	)){
					Notification.error({message: 'end date not valid', delay: 3000});
					acceptedDates = false;
					break;
				}

				if(Date.parse($scope.statutoryRates[$scope.type][i].validFrom) >= Date.parse(newElement.validFrom) &&
				Date.parse($scope.statutoryRates[$scope.type][i].validTo) <= Date.parse(newElement.validTo	)){
					Notification.error({message: 'The new range cannot contain an existing range', delay: 3000});
					acceptedDates = false;
					break;
				}
			}
			return acceptedDates;
		}

		$scope.updateValidTo = function(validFrom){
			console.log('0');
			console.log(validFrom);
			var d = validFrom;
	    var day = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());
			$scope.newElement.validTo = day;
		};

		$scope.addNew = function(newElement){
			$scope.loading = true;
			if(checkDates(newElement) === true){
				newElement.notSaved = true;
				$scope.statutoryRates[$scope.type].push(angular.copy(newElement));
				$scope.newElement = {};
			}
		};

		function deleteFromDb (id, index){
			StatutoryRatesService.deleteFromStatutoryRates(id,$scope.type)
			.then(function(res){
				console.log(res);
				$scope.statutoryRates[$scope.type].splice(index,1);					
				$scope.loading = false;
			},function(){
				$scope.loading = false;
			});
		}
		

		$scope.deleteOne = function(validFrom){
			console.log(validFrom);
			for(var i = 0; i < $scope.statutoryRates[$scope.type].length; i++){
				if($scope.statutoryRates[$scope.type][i].validFrom+'' === validFrom+''){
					console.log($scope.statutoryRates[$scope.type][i].notSaved);
					if($scope.statutoryRates[$scope.type][i].notSaved &&
					$scope.statutoryRates[$scope.type][i].notSaved === true){
						$scope.statutoryRates[$scope.type].splice(i,1);	
					}else{
						console.log(validFrom);
						deleteFromDb($scope.statutoryRates[$scope.type][i]._id, i);
					}
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
				$scope.getCurrentForAll();
			},function(){
				$scope.loading = false;
			});
		};

		$scope.getCurrent = function(type){
			console.log(type);
			var current ;
			var d = new Date();
			var today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
			for(var i = 0; i < $scope.statutoryRates[type].length; i++){
				if(Date.parse($scope.statutoryRates[type][i].validFrom) <= Date.parse(today) &&
					Date.parse($scope.statutoryRates[type][i].validTo) >= Date.parse(today)){
					$scope.statutoryRates[type][i].isCurrent = true;
					current = $scope.statutoryRates[type][i].amount;
					break;
				}
			}
			return current;
		};

		$scope.getCurrentForAll = function(){
			for(var key in $scope.statutoryRates){
				$scope.statutoryRates[key].current = $scope.getCurrent(key);
			}
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
			$scope.getCurrentForAll();
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