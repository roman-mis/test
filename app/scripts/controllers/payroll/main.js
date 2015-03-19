'use strict';
var app = angular.module('origApp.controllers');
app.controller('PayrollMainController',['$state', '$rootScope', '$scope', 'HttpResource', 'ModalService','payroll',
	function($state,$rootScope,$scope,HttpResource,ModalService,payroll){	

    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
                          {link: '/payroll/home', text: 'Payroll'}
                          ];

   $scope.payroll = {};
   $scope.allPayrolls = [];
   $scope.agencyIndex = -1;
   $scope.comparingList = [];
   $scope.periodTypeValues = [];
   $scope.periodType = 'weekly';
   $scope.payroll = {};

   HttpResource.model('constants/candidateProfile').customGet('', {}, function (data) {
       //if (data.statusText === 'OK') {
           console.log('candidateProfile');
            console.log(data);
           //$scope.periodTypeValues = data.data;
       //}
   });

    HttpResource.model('constants/payfrequencies').customGet('',{},function(data){
        if(data.statusText === 'OK' ){
            // console.log('data');
            // console.log(data);
            $scope.periodTypeValues = data.data;
        }
    });

	
    $scope.openRunPayroll = function(){
        ModalService.open({
          templateUrl: 'views/payroll/runPayroll.html',
          parentScope: $scope,
          controller: 'runPayrollController',
          size: 'lg'
      });
    };

    $scope.openCreateValidation = function(){
        console.log(220);
        ModalService.open({
          templateUrl: 'views/payroll/createValidation.html',
          parentScope: $scope,
          controller: 'createValidationController',
          size: 'lg'
      });
    };

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
    };

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
    		s += ar[i];
    	}
    	return s;
    };

    $scope.getPayroll = function(periodType){
        periodType = periodType || 'weekly';
        // console.log(periodType);
        $scope.periodType = periodType;
        var params={periodType:periodType,isCurrent:true};
        // console.log(params);

        HttpResource.model('payroll').query(params,function(data){
            // console.log('done !!');
            $scope.payroll =  data.data.objects[0];
            payroll.details =  data.data.objects[0];
            // console.log(payroll);
        });
    };
    $scope.getPayroll();


    $scope.viewCompanies = function(filter){
    	$scope.payroll.agencyList=[];
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
         $scope.payroll.agencyList.push($scope.payroll.agencies[i]);
     }
    }
    console.log(111111111111)
  $state.go('app.payroll.view',{type:state});
};

    $scope.viewAction = function(){
      $scope.payroll.agencyList = [];
      for(var i = 0; i < $scope.payroll.agencies.length; i++){
       $scope.payroll.agencyList.push($scope.payroll.agencies[i]);
      }
      $state.go('app.payroll.view',{type:'All'});	
    };

    
    $scope.createInvoice = function () {
        ModalService.open({
          templateUrl: 'views/payroll/createInvoice.html',
          parentScope: $scope,
          controller: 'createInvoiceController2',
          size:'lg'
      });
    };


    $scope.importTimesheets = function () {
        ModalService.open({
          templateUrl: 'views/payroll/importTimesheets.html',
          parentScope: $scope,
          controller: 'importTimesheetsController',
          size:'md'
      });
    };
}]);



