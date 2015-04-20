  'use strict';
  var app = angular.module('origApp.controllers');

  app.controller('runPayrollController',['$rootScope', '$scope', 'HttpResource','$http','payroll',
  	function($rootScope,$scope,HttpResource,$http,payroll){
  		$scope.pay = {frequency:''};
  		$scope.agency = {id:''};
  		$scope.p = {};
  		$scope.p.worker=[];
  		$scope.selection = {type: false};
  		$scope.agencyList = [];
  		$scope.PayFrequency = [];
  		$scope.option = {};
  		// $scope.firstStep = true;
  		// $scope.secondStep = false;

  		console.log('$$$$$$$$$$$$$$$$$$$$$$$$$');


  $rootScope.breadcrumbs = [{link:'/', text:'Home'},
                            {link: '/payroll/home', text: 'Payroll'},
                            {link: '/payroll/home/runPayroll', text: 'Run Payroll'}
                            ];


      HttpResource.model('constants/payfrequencies').customGet('',{},function(data){
        if(data.statusText === 'OK' ){
            console.log('data');
            console.log(data);
            $scope.PayFrequency = data.data;
        }
      });

  		$scope.payroll = payroll;
  		console.log($scope.payroll);

  		function initWorkerSelection(limit){
      	$scope.p.worker=[];
      	for(var i = 0; i < limit; i++){
      		$scope.p.worker[i] = false;	
      	}
      }

      
      $scope.getPayrollRunWorker = function(){
      	if($scope.pay.frequency === '' || $scope.agency.id === ''){
      		return;
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
      	// $scope.pay.frequency = 2;
      	console.log($scope.pay.frequency);
      	console.log($scope.agency.id);

      	$http.get('/api/candidates?worker.payrollTax.payFrequency='+$scope.pay.frequency+'&worker.payrollProduct.agency='+$scope.agency.id)
      	.success(function(data) {
  		  	 console.log(data); 
  		  	 $scope.candidates = data.objects;
  		  	 console.log($scope.candidates); 
           $scope.candidatesTimesheets =[];
           
  		  	 initWorkerSelection($scope.candidates.length);
  		}).error(function() {


  		});
      };

      $scope.unselectHead = function(){
  		$scope.selection.type = false;
  	};

  	$scope.selectAll = function(){
  		for(var i = 0; i < $scope.p.worker.length; i++){
      		$scope.p.worker[i] = $scope.selection.type;	
      	}
  	};

  	// $scope.closeModal = function() {

   //    //  Manually hide the modal using bootstrap.
   //    $element.modal('hide');

   //    //  Now close as normal, but give 500ms for bootstrap to animate
   //    close(null, 500);
   //  };

  	// $scope.close = function(){
  	// 	$modalInstance.close();
  	// };
    // HttpResource.model('timesheets/candidatetimesheets/54cf9e69f383e9be63a0d663').query({},function(response) {
    //     // if(!response.data.result){
    //       // $scope.response = response.data.logs;
    //       console.log(response);
    //     });
    

    
    // $http.get('api/timesheets/candidatetimesheets/54cf9e69f383e9be63a0d663').then(
  	$scope.runPayroll = function(){
  		var runParollWorkers = {
          workers : [],
          payFrequency:$scope.pay.frequency,
  			  agencyId:$scope.agency.id
        };
  			console.log($scope.pay.frequency);
  		for(var i = 0; i < $scope.p.worker.length; i++){
  			if($scope.p.worker[i]){
  				runParollWorkers.workers.push({_id: $scope.candidates[i]._id});
  			}
  		}    
  		HttpResource.model('payroll/run').create(runParollWorkers).post().then(function(response) {
  	    	$scope.response = response.data.logs;
          console.log(response);
  	    	console.log(runParollWorkers);
          console.log($scope.p.worker);
      });
	  };




  }]);	
