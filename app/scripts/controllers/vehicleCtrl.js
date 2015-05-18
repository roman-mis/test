'use strict';
angular.module('origApp.controllers')
	.controller('vehicleCtrl', ['$scope', 'ConstantsResource', 'HttpResource', '$modalInstance', 'parentScope',
		function($scope, ConstantsResource, HttpResource, $modalInstance, parentScope) {
			$scope.fuelTypes = ConstantsResource.get('fuels');
			HttpResource.model('candidates/' + parentScope.user._id + '/vehicleinformation/1')
				.query({}, function(res) {
					var vehicleInfo = res.data.object.vehicleInformaiton;
					if(Object.keys(vehicleInfo).length>0){
						$scope.vehicle = {
							fuelType: vehicleInfo.fuelType.code,
							engineSize: vehicleInfo.engineSize.code,
							make: vehicleInfo.make,
							registration: vehicleInfo.registration,
							companyCar: vehicleInfo.companyCar
						};
						if ($scope.vehicle.fuelType) {
							$scope.onChangeFuelType();
						}
					}
				});
			$scope.onChangeFuelType = function() {
				console.log($scope.fuelTypes);
				var filtered = $scope.fuelTypes.filter(function(item) {
					return item.code === $scope.vehicle.fuelType;
				});
				if (filtered.length > 0) {
					$scope.engineSizes = filtered[0].engineSizes;
				} else {
					$scope.engineSizes = [];
				}
			};

			$scope.save = function() {
				$scope.isVehicleSaving = true;
				HttpResource.model('candidates/' + parentScope.user._id)
					.create($scope.vehicle)
					.patch('vehicleinformation/1')
					.then(function(response) {
						$scope.isVehicleSaving = false;
						if (!HttpResource.flushError(response)) {
							$modalInstance.close();
						}
					});
			};
			$scope.cancel = function(){
				$modalInstance.close();
			};
		}
	]);