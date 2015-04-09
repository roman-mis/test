'use strict';
angular.module('origApp.controllers')
.controller('payrollTimesheetsCtrl', ['$scope','HttpResource', 'ConstantsResource',
	function($scope, HttpResource, ConstantsResource){
		$scope.payfrequencies = ConstantsResource.get('payfrequencies');
		HttpResource.model('timesheetbatches/with/timesheets').customGet('',{},function(timesheetBatches){
  	console.log('agencies done !!');
  	console.log(timesheetBatches);
  	$scope.timesheetBatches = timesheetBatches.data.objects;

  	for(var i = 0; i < $scope.timesheetBatches.length; i++){
  		console.log('*')
  		generateTimesheetBatchesData(i);
  	}
	});

		function generateTimesheetBatchesData(index){
			$scope.timesheetBatches[index].total =0;
			$scope.timesheetBatches[index].gross =0;
			$scope.timesheetBatches[index].vat =0;
			for(var i = 0; i < $scope.timesheetBatches[index].timesheets.length; i++){
				$scope.timesheetBatches[index].total += $scope.timesheetBatches[index].timesheets[i].total;
				$scope.timesheetBatches[index].gross =$scope.timesheetBatches[index].timesheets[i].net;
				$scope.timesheetBatches[index].vat =$scope.timesheetBatches[index].timesheets[i].vat;
			}
			console.log($scope.timesheetBatches[index].total);
		}

	}]);