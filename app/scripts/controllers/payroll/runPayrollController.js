var app = angular.module('origApp.controllers');

app.controller('runPayrollController',['$rootScope', '$scope', 'HttpResource', 'ModalService','$http','payroll','$modalInstance',
	function($rootScope,$scope,HttpResource,ModalService,$http,payroll,$modalInstance){
		$scope.pay = {frequency:''}
		$scope.agency = {id:''}
		$scope.runPayroll={};
		$scope.selection = {type: false};
		$scope.agencyList = [];

	
		$scope.PayFrequency = [{
			code:"1",
			description:"Weekly"
		},{
			code:"2",
			description:"Bi-Weekly"
		},{
			code:"3",
			description:"4 Weekly"
		},{
			code:"4",
			description:"Monthly"
		}];

		$scope.payroll = payroll.details;
		console.log($scope.payroll);

		    function initWorkerSelection(limit){
    	$scope.runPayroll.worker=[];
    	for(var i = 0; i < limit; i++){
    		$scope.runPayroll.worker[i] = false;	
    	}
    }

    $scope.getPayrollRunWorker = function(){
    	if($scope.pay.frequency === '' || $scope.agency.id === ''){
    		return
    	}
    	var params={worker:{
    		payrollTax:{
    			payFrequency:'1'
    		},
    		payrollProduct:{
    			agency:$scope.agency.id
    		}
    	}};
    	console.log(params);
    	$http.get('/api/candidates?worker.payrollTax.payFrequency='+$scope.pay.frequency+'&worker.payrollProduct.agency='+$scope.agency.id)
    	.success(function(data, status, headers, config) {
		  	 console.log(data); 
		  	 $scope.candidates = data.objects;
		  	 console.log($scope.candidates); 
		  	 initWorkerSelection($scope.candidates.length);
		}).error(function(data, status, headers, config) {


		});
    }

    $scope.unselectHead = function(){
		$scope.selection.type = false;
	}

	$scope.selectAll = function(){
		for(var i = 0; i < $scope.runPayroll.worker.length; i++){
    		$scope.runPayroll.worker[i] = $scope.selection.type;	
    	}
	}

	$scope.runPayroll = function(){
		var runParollWorkers = {workers : []};
		for(var i = 0; i < $scope.runPayroll.worker.length; i++){
			if($scope.runPayroll.worker[i]){
				runParollWorkers.workers.push({_id: $scope.candidates[i]._id});
			}
		}
		console.log(runParollWorkers)
		HttpResource.model('payroll/run').create(runParollWorkers).post().then(function(response) {
            console.log(response);
          if (!HttpResource.flushError(response)) {
          	console.log('donePosting');
            console.log(response);
            $modalInstance.close();
          }
        });
	}

	$scope.close = function(){
		$modalInstance.dismiss('cancel');
	}

}]);	
