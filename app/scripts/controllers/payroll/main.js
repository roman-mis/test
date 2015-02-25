var app = angular.module('origApp.controllers');

app.controller('PayrollMainController',['$state', '$rootScope', '$scope', 'HttpResource','ModalService',
	function($state,$rootScope,$scope,HttpResource, ModalService){	
		console.log('hello');
	$scope.payroll = {};
	$scope.allPayrolls = [];
	$scope.agencyIndex = -1;
	$scope.comparingList = [];
	$scope.periodTypeValues = ['weekly', 'twoWeekly', 'fourWeekly', 'monthly'];
	$scope.periodType = 'weekly'
	$scope.pay = {frequency:''}
	$scope.agency = {id:''}
	$scope.runPayroll={};
	$scope.selection = {type: false};


	$scope.camelCaseFormate = function(s){
    	var ar = s.split(' ');
    	s = '';
    	for(var i = 0; i< ar.length; i++){
    		var arr = ar[i].split('');
    		if(i === 0){
    			arr[0] = arr[0].toLowerCase();
    		}else{
				arr[0] = arr[0].toUpperCase();
    		}
    		s = s+ arr.join('');
    	}
    	return s;
    }

    $scope.unCamelCaseFormate = function(s){
    	if(!s || s.length === 0){
    		return s;
    	}	
    	var ar = s.split('');
    	s = ar[0].toUpperCase();
    	for(var i = 1; i < ar.length; i++){
    		if(ar[i] === ar[i].toUpperCase()){
    			s += ' ';
    		}
    		s += ar[i]
    	}
    	return s;
    }

    $scope.getPayroll = function(periodType){
    	periodType = periodType || 'weekly';
    	$scope.periodType = periodType;
    	var params={periodType:periodType,isCurrent:true};
    	console.log(params);

    	HttpResource.model('payroll').query(params,function(data){
	      	console.log('done !!');
	        $scope.payroll =  data.data.objects[0];
	    	console.log($scope.payroll);
		});
    }
    $scope.getPayroll();

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
    			payFrequency:$scope.pay.frequency
    		},
    		payrollProduct:{
    			agency:$scope.agency.id
    		}
    	}};
    	console.log(params);
    	HttpResource.model('candidates').query(params,function(data){
		// HttpResource.model('users').customGet('',{},function(data){
			console.log('done !! candidates');
	      	console.log(data.data.objects);
	      	$scope.candidates = data.data.objects;
	      	initWorkerSelection($scope.candidates.length);
		});
    }
	
	$scope.viewAction = function(){
		$state.go('app.payroll.viewAll')		
	}

	$scope.unselectHead = function(){
		$scope.selection.type = false;
	}

	$scope.selectAll = function(){
		for(var i = 0; i < $scope.runPayroll.worker.length; i++){
    		$scope.runPayroll.worker[i] = $scope.selection.type;	
    	}
	}

	$scope.Runpayroll = function(){
		
	}

    $scope.createInvoice = function () {
        ModalService.open({
          templateUrl: 'views/payroll/createInvoice.html',
          parentScope: $scope,
          size:'lg'
      });
    }


	$scope.test = function(){
		console.log($scope.pay.frequency);
		console.log($scope.agency.id);
		console.log($scope.runPayroll.worker);
	}


}]);



