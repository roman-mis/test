'use strict';
angular.module('origApp.controllers')
	.controller('vehicleCtrl', ['$scope', 'ConstantsResource', 'HttpResource', '$modalInstance', 'parentScope',
		function ($scope, ConstantsResource, HttpResource, $modalInstance, parentScope) {
			$scope.fuelTypes = ConstantsResource.get('fuels');
			$scope.onChangeFuelType = function () {
	      console.log($scope.fuelTypes);
	      var filtered = $scope.fuelTypes.filter(function (item) {
	          return item.code === $scope.vehicle.fuelType;
	      });
	      if (filtered.length > 0) {
	          $scope.engineSizes = filtered[0].engineSizes;
	      } else {
	          $scope.engineSizes = [];
	      }
	    };

	    $scope.save = function () {
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
	}]);