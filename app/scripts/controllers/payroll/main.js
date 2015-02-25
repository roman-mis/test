var app = angular.module('origApp.controllers');

app.controller('PayrollMainController',['$state', '$rootScope', '$scope', 'HttpResource', 'ModalService','$http','payroll',
	function($state,$rootScope,$scope,HttpResource,ModalService,$http,payroll){	
		console.log('hello');
	$scope.payroll = {};
	$scope.allPayrolls = [];
	$scope.agencyIndex = -1;
	$scope.comparingList = [];

	$scope.periodTypeValues = ['weekly', 'twoWeekly', 'fourWeekly', 'monthly'];

    $scope.periodTypeValues = [{
            code:"weekly",
            description:"Weekly"
        },{
            code:"twoWeekly",
            description:"Bi-Weekly"
        },{
            code:"fourWeekly",
            description:"4 Weekly"
        },{
            code:"monthly",
            description:"Monthly"
        }];
	
	$scope.periodType = 'weekly'
	// $scope.pay = {frequency:''}
	// $scope.agency = {id:''}
	$scope.runPayroll={};
	$scope.selection = {type: false};
	$scope.agencyList = [];

    $scope.openRunPayroll = function(){
        ModalService.open({
          templateUrl: 'views/payroll/runPayroll.html',
          parentScope: $scope,
          controller: 'runPayrollController',
          size: 'lg'
        });
    }

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
        console.log(periodType)
    	$scope.periodType = periodType;
    	var params={periodType:periodType,isCurrent:true};
    	console.log(params);

    	HttpResource.model('payroll').query(params,function(data){
	      	console.log('done !!');
            $scope.payroll =  data.data.objects[0];
	        payroll.details =  data.data.objects[0];
	    	console.log(payroll);
		});
    }
    $scope.getPayroll();


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

	

}]);



