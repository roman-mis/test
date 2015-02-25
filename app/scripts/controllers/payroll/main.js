var app = angular.module('origApp.controllers');

app.controller('PayrollMainController',['$state', '$rootScope', '$scope', 'HttpResource', 'ModalService','$http',
	function($state,$rootScope,$scope,HttpResource,ModalService,$http){	
		console.log('hello');
	$scope.payroll = {};
	$scope.allPayrolls = [];
	$scope.agencyIndex = -1;
	$scope.comparingList = [];
	$scope.periodTypeValues = ['weekly', 'twoWeekly', 'fourWeekly', 'monthly'];
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
	$scope.periodType = 'weekly'
	$scope.pay = {frequency:''}
	$scope.agency = {id:''}
	$scope.runPayroll={};
	$scope.selection = {type: false};
	$scope.agencyList = [];


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
  //   	HttpResource.model('candidates').query(params,function(data){
		// // HttpResource.model('candidates/?worker.payrollTax.payFrequency=1&worker.payrollProduct.agency=54c8bb4b27df08b003488587').customGet('',{},function(data){
		// 	console.log('done !! candidates');
	 //      	console.log(data.data.objects);
	 //      	$scope.candidates = data.data.objects;
	 //      	initWorkerSelection($scope.candidates.length);
		// });
    }

    $scope.viewCompanies = function(filter){
    	$scope.agencyList=[];
    	var state = '';
    	switch(filter){
    		case 'Schedules Uploaded':
    			state = 'scheduleReceived';
    		break;
    		
    		case 'Validations Approved':
    			state = 'validationReceived';
    		break;
    		
    		case 'Invoices sent':
    			state = 'invoiceSent';
    		break;
    		
    		case 'Invoices Receipted':
    			state = 'invoiceRaised';
    		break;

    		case 'Awaiting Payroll':
    			state = 'moneyReceived';
    		break;
    		
    		case 'Number of Payrolls Unpaid':
    			state = 'paymentConfirmed';
    		break;
    	}
    	for(var i = 0; i < $scope.payroll.agencies.length; i++){
    		if($scope.payroll.agencies[i][state]){
    			$scope.agencyList.push($scope.payroll.agencies[i].agency.name);
    			console.log($scope.agencyList);
    		}
    	}    	

    	// ModalService.open({
     //          templateUrl: 'views/partials/agencyList.html',
     //          inputs: $scope.agencyList,
     //          size: 'sm'
     //        });
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
          }
        });
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



