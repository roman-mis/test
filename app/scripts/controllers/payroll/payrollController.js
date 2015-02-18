var app = angular.module('origApp.controllers');

app.controller('payrollController',['$rootScope', '$scope', 'HttpResource',
	function($rootScope,$scope,HttpResource){	
		console.log('hello');
	
	$scope.camelCaseFormate = function(s){
    	ar = s.split(' ');
    	s = '';
    	for(var i = 0; i< ar.length; i++){
    		arr = ar[i].split('');
    		if(i === 0){
    			arr[0] = arr[0].toLowerCase();
    		}else{
				arr[0] = arr[0].toUpperCase();
    		}
    		s = s+ arr.join('');
    	}
    	return s;
    }



	$scope.agencyCheckListLabels= ['Schedule Received', 'Time Sheets Uploaded', 'Expenses Uploaded',
		'Margin Uploaded', 'Validation Created', 'Validation Sent', 'Validation Received',
		'Invoice Raised', 'InvoiceSent', 'Money Received', 'Payroll Run', 'Bacs Uploaded',
		'Payment Confirmed', 'Reports Created'];
	$scope.viewAll = false;
		$scope.agencyCheckListValues={};
	for(var i = 0; i < $scope.agencyCheckListLabels.length; i++){
		// console.log($scope.camelCaseFormate($scope.agencyCheckListLabels[i]));
		$scope.agencyCheckListValues[$scope.camelCaseFormate($scope.agencyCheckListLabels[i])] = true;
	}

	console.log($scope.agencyCheckListLabels);
	
	$scope.viewAction = function(){
		$scope.viewAll = ! $scope.viewAll;		
	}
	

	$scope.checkUncheck = function(index){
		$scope.agencyCheckListValues[$scope.camelCaseFormate($scope.agencyCheckListLabels[index])] = !		
		$scope.agencyCheckListValues[$scope.camelCaseFormate($scope.agencyCheckListLabels[index])]		
	}

$scope.payroll =  {
weekNumber: 1,
monthNumber: 2,
periodType: 1,
stats: {
awaitingPayroll: 6,
payrollsUnpaid: 5,
invoicesReceipted: 4,
invoicesSent: 3,
validationsApproved: 2,
schedulesUploaded: 1
},
agencies: [
{
agency: 1212,
scheduleReceived: true,
timesheetsUploaded: true,
expensesUploaded: true,
marginUploaded: true,
validationCreated: true,
validationSent: true,
validationReceived: true,
invoiceRaised: true,
invoiceSent: true,
moneyReceived: true,
payrollRun: true,
bacsUploaded: true,
paymentConfirmed: true,
reportsCreated: true
}
]
}
console.log($scope.payroll);

// HttpResource.model('payroll').create(payroll).post().then(function(response) {
// 	              if (!HttpResource.flushError(response)) {
// 	                console.log(response)
// 	              }
// 	            });

	// x = HttpResource.model('payroll').customGet('',{},function(data){
	// 	console.log("done")
	// 	console.log(x)
	// 	console.log(data)
	// });
}]);