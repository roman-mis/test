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
         for (var i = 0; i < $scope.candidates.length; i++) {
          HttpResource.model('timesheets/candidatetimesheets/'+$scope.candidates[i]._id).query({},function(response) {
           $scope.timesheets = response.data.objects;
           $scope.candidatesTimesheets.push({id:$scope.candidates[i],timesheets:$scope.timesheets});
      // if(!response.data.result){
        // $scope.response = response.data.logs;
        console.log(response);
      });
         }
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
  HttpResource.model('timesheets/candidatetimesheets/54cf9e69f383e9be63a0d663').query({},function(response) {
      // if(!response.data.result){
        // $scope.response = response.data.logs;
        console.log(response);
      });
  $http.get('api/timesheets/candidatetimesheets/54cf9e69f383e9be63a0d663').then(function (res) {
    // body...
    console.log(res);
  });
	$scope.runPayroll = function(){

      $scope.margins = function () {
        // body...
         $scope.MarginTypes = function(index,type,rule) {
          // body...
          if(type === 'fixedFee'){
              if(rule ==='Use Candidate'){
                $scope.fixedFeeMargin = $scope.workersMargins[index].fixedFee;
                }else{
                  $scope.fixedFeeMargin = $scope.agencyMargins.fixedFee;
                }
                $scope.margin = ($scope.fixedFeeMargin);
            
          }else if(type ==='percentageOfTimesheets'){
            
              $scope.margin = ($scope.candidatesWithApprovedTimesheets[index].timesheetsTotals * $scope.checkPercentage(index,rule)/100);
            
          }else if (type ==='totalHours'){
            if(rule === 'Use Candidate'){
              $scope.margin;// to be calculated (ask andy)
            }else{

            }

          }else if(type === 'fixedOnTimesheets'){
            if(rule === 'Use Candidate'){
              $scope.fixedOnTimesheetsMargin = $scope.workersMargins[index].fixedOnTimesheets;
            }else{
              $scope.fixedOnTimesheetsMargin = $scope.agencyMargins.fixedOnTimesheets;
            }
            
              $scope.margin = ($scope.candidatesWithApprovedTimesheets[index].timesheets.length *$scope.fixedOnTimesheetsMargin);
            
          }

          return $scope.margin;

        };
          for(var i=0; i<$scope.candidatesWithApprovedTimesheets.length;++i){
            if($scope.workersMargins[i].marginRule ==='Use Candidate'){
              $scope.rule = 'Use Candidate';
              $scope.type = $scope.workersMargins[i].marginType;
            }else{
              $scope.rule = 'Use Agency';
              $scope.type = $scope.agencyMargins.marginType;
            }
            $scope.marginsOnWorkers.push($scope.MarginTypes(i,$scope.type,$scope.rule));
          }
        return $scope.marginsOnWorkers;
      };

      $scope.checkPercentage = function (index,rule) {
        // body... //IMPLEMENTING BINARY SEARCH HERE....
        if(rule ==='Use Candidate'){
          $scope.tsSearch =$scope.candidatesWithApprovedTimesheets[index].timesheetsTotals;
          $scope.searchArrays = $scope.workersMargins[index].margin.percentageOfTimesheets;
          if ($scope.tsSearch<$scope.searchArrays[0].from||$scope.tsSearch>$scope.searchArrays[0].to) {
            console.log('not found')
          }else{
            
            if($scope.midValue ){}
          }
          
        }
      }
		var runParollWorkers = {workers : [],
			payFrequency:$scope.pay.frequency};
			console.log($scope.pay.frequency);
		for(var i = 0; i < $scope.p.worker.length; i++){
			if($scope.p.worker[i]){
				runParollWorkers.workers.push({_id: $scope.candidates[i]._id});
			}
		}
		console.log(runParollWorkers);
      //http resource get workers with timesheets in $scope.candidatesWithTimesheets
      HttpResource.model('arrayOfCandidatesWithTheirTimesheets').query({},function (res) {
        // body...
        $scope.candidatesWithTimesheets = res.data.object;
        $scope.candidatesWithApprovedTimesheets = [];
        for (var i = 0; i < $scope.candidatesWithTimesheets.length; i++) {
          //creating a new property on each object in the array.
      //get timesheets totals in $scope.timesheetsTotals for loop on $scope.candidatesWithTimesheets
      //within the same for loop just add up the timesheets with status of approved; will return $scope.candidatesWithApprovedTimesheets
          if($scope.candidatesWithTimesheets[i].timesheets[i].status ==='approved'){
            $scope.candidatesWithApprovedTimesheets.push({id:$scope.candidatesWithTimesheets[i]._id,
                                                          timesheets:$scope.candidatesWithTimesheets[i].timesheets,
                                                          timesheetsTotals: $scope.candidatesWithTimesheets[i].timesheets[i].total
                                                        });
          }
        }
        HttpResource.get('workersWithMargins').query({},function (res) {
          // body... these must return array of the workers of the approved timesheets and their margin scheme
          // ORDER IS TOO DAMN IMPORTANT
          $scope.workersMargins = res.data.object;
          HttpResource.get('agencies/'+$scope.agency._id+'/marginFee').query({},function (res) {
            // body...
            $scope.agencyMargins = res.data.object;


          });
        });

      });
      //http resource get workers margins $scope.workersMargins 
      //http resource get angecy margin; $scope.agencyMargins;
      //function takes $scope.timesheetsTotals to check whether it lies within an interval or not checkPercentage(agency,candidate)//if agency use agency margins if candidate use candidate margins
      ////working after the third call back has responded

      $scope.margins();
      for (i = 0; i < runParollWorkers.workers.length; i++) {
        runParollWorkers.workers[i].margin = $scope.marginsOnWorkers[i];
      }
		HttpResource.model('payroll/run').create(runParollWorkers).post().then(function(response) {
	    // if(!response.data.result){
        //change payrolled timesheets status' payrolled // WILL USE MOS' API
	    	$scope.response = response.data.logs;
        console.log(response);
	    	console.log(runParollWorkers);
        console.log($scope.p.worker);
				// $scope.firstStep = false;
				// $scope.secondStep = true;
	    // }else{
	    // 	$scope.close();
	    // }
    });
	};




}]);	
