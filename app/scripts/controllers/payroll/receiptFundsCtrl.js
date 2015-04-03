'use strict';
angular.module('origApp.controllers')
.controller('receiptFundsCtrl', ['$scope','$modalInstance','HttpResource', 'ModalService', 'ConstantsResource',
	function($scope, $modalInstance, HttpResource, ModalService, ConstantsResource){
	
	var allTimeSheets = [];
	$scope.agencies = [];
	HttpResource.model('timesheets/with/agency').customGet('',{},function(timesheets){
  	console.log('agencies done !!');
    console.log(timesheets);
    allTimeSheets = timesheets.data.object;
    timesheets.data.object.forEach(function(timesheet){
    	var found = false;
    	for(var i = 0; i < $scope.agencies.length; i++){
    		if($scope.agencies[i].name === timesheet.agency.name){
    			found = true;
    			break;
    		}
    	}
  		if(!found){
  			$scope.agencies.push({name:timesheet.agency.name,id:timesheet.agency._id})
  		}
    });

    $scope.selectedAgencyId = $scope.agencies[0].id;
    $scope.getAgencyTimesheets($scope.selectedAgencyId);
	});

	$scope.getAgencyTimesheets = function(id){
		$scope.agencyTimesheets = [];
		$scope.selectedTimesheets = [];
		allTimeSheets.forEach(function(timesheet){
			if(timesheet.agency._id === id){
				$scope.agencyTimesheets.push(timesheet);
				$scope.selectedTimesheets.push(false);
			}
		});
		console.log($scope.agencyTimesheets)
	};

	

	$scope.markAsReceived = function () {
		
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);
