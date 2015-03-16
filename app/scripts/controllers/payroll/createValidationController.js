'use strict';
var app = angular.module('origApp.controllers');
app.controller('createValidationController',['$state', '$rootScope', '$scope', 'HttpResource', '$modalInstance',
	function($state,$rootScope,$scope,HttpResource,$modalInstance){	
	
	$scope.agencies 				= [];
	$scope.branches 				= [];
	$scope.agency 					= {};
	$scope.branch 					= {};
	$scope.timesheetbatches = {};
	
		
	HttpResource.model('agencies/with/timesheetBatches').customGet('',{},function(agencies){
  	console.log('agencies done !!');
    console.log(agencies);
    $scope.agencies = agencies.data.objects;
	});

	// HttpResource.model('candidates/54cf9e69f383e9be63a0d663/expenses').customGet('',{},function(agencies){
 //  	console.log('agencies done !!');
 //    console.log(agencies);
 //    $scope.agencies = agencies.data.objects;
	// });
	
	$scope.selectAgency  = function(id){
		for (var i =  0; i < $scope.agencies.length; i++) {
			if($scope.agencies[i]._id === id){
				$scope.agency.name = $scope.agencies[i].name;
				console.log($scope.agencies[i].branches);
				$scope.branches = $scope.agencies[i].branches;
				$scope.branch = {};
				$scope.timesheetbatches = $scope.agencies[i].timesheetBatches;
				break;
			}
		}
		// $scope.getTimeSheets(false);
	};

	$scope.selectBranch  = function(id){
		for (var i =  0; i < $scope.branches.length; i++) {
			if($scope.branches[i]._id === id){
				$scope.branch.name = $scope.branches[i].name;
			}
		}
		if($scope.branch.name){
			
			// $scope.getTimeSheets(true);
		}
	};

	$scope.getTimeSheets = function(withBranch){
		var params = {};
		params.agency = $scope.agency.id;
		if(withBranch === 'true'){
			params.branch._id = $scope.branch.id;
		}
		console.log(params);

		// HttpResource.model('timesheetbatches').query(params,function(timesheetbatches){
	 //  	console.log('timeSheets done !!');
	 //    console.log(timesheetbatches);
	 //    $scope.timesheetbatches = timesheetbatches.data.objects;
		// });
	};

	$scope.selectAll = function(v){
		for(var i = 0; i < $scope.timesheetbatches.length; i++){
			$scope.timesheetbatches[i].select = v;
		}
	};

	$scope.validate = function(){
		for(var i = 0; i < $scope.timesheetbatches.length; i++){
			console.log($scope.timesheetbatches[i].select);
		}
	};

	$scope.count = function(timesheetbatches){
		var c = 0;
		for(var i = 0; i < timesheetbatches.length; i++){
			if(timesheetbatches[i].select === true){
				c++;
			}
		}
		return c;
	};

	$scope.close = function(){
		$modalInstance.close();
	};


}]);
