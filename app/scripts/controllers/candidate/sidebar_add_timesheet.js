.controller('CandidateSidebarAddTimesheetController', function($scope, $modalInstance) {
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.ok = function() {
		$modalInstance.close();
	};
});