var app = angular.module('origApp.controllers');

app.controller('runPayrollController',['$rootScope', '$scope', 'HttpResource', 'ModalService','$http','payroll','$modalInstance',
	function($rootScope,$scope,HttpResource,ModalService,$http,payroll,$modalInstance){
		$scope.pay = {frequency:''}
		$scope.agency = {id:''}
		$scope.p = {};
		$scope.p.worker=[];
		$scope.selection = {type: false};
		$scope.agencyList = [];
		$scope.PayFrequency = [];
		$scope.firstStep = true;
		$scope.secondStep = false;



    HttpResource.model('constants/payfrequencies').customGet('',{},function(data){
      if(data.statusText === 'OK' ){
          console.log('data');
          console.log(data);
          $scope.PayFrequency = data.data;
      }
    });

		$scope.payroll = payroll.details;
		console.log($scope.payroll);

		    function initWorkerSelection(limit){
    	$scope.p.worker=[];
    	for(var i = 0; i < limit; i++){
    		$scope.p.worker[i] = false;	
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
		for(var i = 0; i < $scope.p.worker.length; i++){
    		$scope.p.worker[i] = $scope.selection.type;	
    	}
	}

	// $scope.closeModal = function() {

 //    //  Manually hide the modal using bootstrap.
 //    $element.modal('hide');

 //    //  Now close as normal, but give 500ms for bootstrap to animate
 //    close(null, 500);
 //  };

	$scope.close = function(){
		$modalInstance.close();
	}

	$scope.runPayroll = function(){
		var runParollWorkers = {workers : [],
			payFrequency:$scope.pay.frequency};
			console.log($scope.pay.frequency)
		for(var i = 0; i < $scope.p.worker.length; i++){
			if($scope.p.worker[i]){
				runParollWorkers.workers.push({_id: $scope.candidates[i]._id});
			}
		}
		console.log(runParollWorkers)
		HttpResource.model('payroll/run').create(runParollWorkers).post().then(function(response) {
	    // if(!response.data.result){
	    	$scope.response = response.data.logs;
	    	console.log($scope.response);
				$scope.firstStep = false;
				$scope.secondStep = true;
	    // }else{
	    // 	$scope.close();
	    // }
    });
	}




}]);	
