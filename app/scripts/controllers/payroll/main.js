'use strict';
var app = angular.module('origApp.controllers');
app.controller('PayrollMainController',['$state', '$rootScope', '$scope', 'HttpResource', 'ModalService', 'payroll','$q', '$modal',
	function($state,$rootScope,$scope,HttpResource,ModalService,payroll,$q,$modal){	

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

   // HttpResource.model('constants/candidateProfile').customGet('', {}, function (data) {
   //     //if (data.statusText === 'OK') {
   //         console.log('candidateProfile');
   //          console.log(data);
   //         //$scope.periodTypeValues = data.data;
   //     //}
   // });

    HttpResource.model('constants/payfrequencies').customGet('',{},function(data){
        if(data.statusText === 'OK' ){
            // console.log('data');
            // console.log(data);
            $scope.periodTypeValues = data.data;
        }
    });


    function getFile(file){
      var d = $q.defer();
    Papa.parse(file, {
      complete: function(results) {
        console.log("Finished:", results.data);
        d.resolve(results);
      }
    });
    return  d.promise;
  }

    $scope.onFileSelect = function($files) {
      console.log($files[0]);
      getFile($files[0]);
      console.log('$$$$$$$$$$$$$$$$$$')
      // parseCSV.get($files[0]).then(function (data) {
        // if($state.current.name != "csv")
        // $state.go("csv");
        // $scope.state.name = 'csv';
        // $scope.saveButton = 'enabled';
        // console.log(data);
        // $scope.data.content = dataHolder.updateData(data, 'clear data');
        // $scope.tree = [];
      // });
    };


	
    // $scope.openRunPayroll = function(){
    //     ModalService.open({
    //       templateUrl: 'views/payroll/runPayroll.html',
    //       parentScope: $scope,
    //       controller: 'runPayrollController',
    //       size: 'lg'
    //   });
    // };

    $scope.openReceiptFunds = function(){
        console.log(220);
        ModalService.open({
          templateUrl: 'views/payroll/receiptFunds.html',
          parentScope: $scope,
          controller: 'receiptFundsCtrl'
      });
    };

    $scope.openCreateValidation = function(){
        console.log(220);
        ModalService.open({
          templateUrl: 'views/payroll/.html',
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
          controller: 'createInvoiceController',
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



