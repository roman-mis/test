'use strict';
angular.module('origApp.controllers')
.controller('statutoryRatesModalController', [ '$scope', '$modalInstance', 'parentScope',
	function ($scope, $modalInstance, parentScope) {

		console.log(parentScope);
		$scope.data = parentScope;
		// $scope.var1 = '12-07-2013';

		$scope.ok = function() {
			$modalInstance.close('ok passed to parent');
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('canceled passed to parent');
		};

	}]);