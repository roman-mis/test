'use strict';
angular.module('origApp.controllers')
.controller('statutoryRatesModalController', [ '$scope', '$modalInstance', 'parentScope',
	function ($scope, $modalInstance, parentScope) {

		$scope.data = parentScope.statutoryRates[parentScope.type];
		// $scope.var1 = '12-07-2013';
		// $scope.addNew = parentScope.addNew;
		// $scope.deleteOne = parentScope.deleteOne;
		// $scope.loading = parentScope.loading;
		$scope.parentScope = parentScope;
		$scope.ok = function() {
			$modalInstance.close('ok passed to parent');
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('canceled passed to parent');
		};

	}]);