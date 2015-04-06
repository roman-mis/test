'use strict';
angular.module('origApp.controllers')
.controller('payrollTimesheetsCtrl', ['$scope','HttpResource', 'ConstantsResource',
	function($scope, HttpResource, ConstantsResource){
		$scope.payfrequencies = ConstantsResource.get('payfrequencies');
		HttpResource.model('timesheetbatches/with/timesheets').customGet('',{},function(timesheetBatches){
  	console.log('agencies done !!');
  	console.log(timesheetBatches);
  	$scope.timesheetBatches = timesheetBatches.data.objects;
	});


	}]);