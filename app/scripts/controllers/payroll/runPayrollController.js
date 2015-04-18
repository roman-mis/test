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

        $scope.margins = function () {
          // body...
           $scope.MarginTypes = function(index,type,rule) {
            // body...
            if(type === 'fixedFee'){
                if(rule ==='candidate'){
                  $scope.fixedFeeMargin = $scope.workersMargins[index].margin.margin.fixedFee;
                  }else{
                    $scope.fixedFeeMargin = $scope.agencyMargins.margin.fixedFee;
                  }
                  $scope.margin = ($scope.fixedFeeMargin);
              
            }else if(type ==='percentageOfTimesheets'){
              
                $scope.margin = ($scope.candidatesWithApprovedTimesheets[index].timesheetsTotals * $scope.checkPercentage(index,rule)/100);
                
            }else if (type ==='totalHours'){
              $scope.margin = $scope.checkHours(index,rule);

            }else if(type === 'fixedOnTimesheets'){
              if(rule === 'candidate'){
                $scope.fixedOnTimesheetsMargin = $scope.workersMargins[index].margin.margin.fixedOnTimesheets;
              }else{
                $scope.fixedOnTimesheetsMargin = $scope.agencyMargins.margin.fixedOnTimesheets;
              }
                $scope.margin = ($scope.candidatesWithApprovedTimesheets[index].timesheets.length *$scope.fixedOnTimesheetsMargin);
              
            }

            return $scope.margin;

          };
            $scope.marginsOnWorkers = [];
            for(var i=0; i<$scope.candidatesWithApprovedTimesheets.length;++i){
              console.log($scope.candidatesWithApprovedTimesheets);
              console.log($scope.workersMargins);
              if($scope.workersMargins[i].margin.margin.marginRule ==='candidate'){
                $scope.rule = 'candidate';
                $scope.type = $scope.workersMargins[i].margin.margin.marginType;
                console.log($scope.type,$scope.rule);
              }else{
                $scope.rule = 'agency';
                $scope.type = $scope.agencyMargins.margin.marginType;
                console.log($scope.type,$scope.rule);

              }
              $scope.marginsOnWorkers.push($scope.MarginTypes(i,$scope.type,$scope.rule));
            }
            console.log($scope.marginsOnWorkers);
          return $scope.marginsOnWorkers;
        };

        $scope.checkPercentage = function (index,rule) {
            $scope.target =$scope.candidatesWithApprovedTimesheets[index].timesheetsTotals;
          if(rule ==='candidate'){
            $scope.searchArrays = $scope.workersMargins[index].margin.margin.percentageOfTimesheets;
              console.log($scope.searchArrays);

            }else{
              $scope.searchArrays = $scope.agencyMargins.margin.percentageOfTimesheets;
              console.log($scope.searchArrays);
            }
            return $scope.searchIntervals($scope.searchArrays,$scope.target);
            
            };
        $scope.checkHours = function (index,rule) {
          // body...
          var searchArrays;
          var target = $scope.candidatesWithApprovedTimesheets[index].totalHours;
          if(rule ==='candidate'){
            searchArrays = $scope.workersMargins[index].margin.margin.totalHours;
          }else{
            searchArrays = $scope.agencyMargins.margin.totalHours;
          }
          return $scope.searchIntervals(searchArrays,target);
        };
          $scope.searchIntervals = function (values,target) {
            // body...
            var chargedAmount =0;
            console.log(values);
            for (var i = 0; i < values.ranges.length; i++) {
              if(target>=values.ranges[i].from&&target<= values.ranges[i].to){
                chargedAmount = values.ranges[i].charged;
                if(values.min > 0){

                if(chargedAmount<values.minAmount){
                  chargedAmount = values.minAmount;
                }
                }
                if(values.maxAmount>0){
                  if(chargedAmount>values.maxAmount){
                    chargedAmount = values.maxAmount;
                    console.log(chargedAmount);
                  }
                }
              }
            }
            return chargedAmount;
          };
        
        var candidatesToPayroll = [];
        $scope.candidatesWithTimesheets =[];
  		var runParollWorkers = {workers : [],
  			payFrequency:$scope.pay.frequency};
  			console.log($scope.pay.frequency);
  		for(var i = 0; i < $scope.p.worker.length; i++){
  			if($scope.p.worker[i]){
  				runParollWorkers.workers.push({_id: $scope.candidates[i]._id});
          candidatesToPayroll.push($scope.candidates[i]._id);
  			}
  		}
  		console.log(runParollWorkers);
        //http resource get workers with timesheets in $scope.candidatesWithTimesheets
        // HttpResource.model('arrayOfCandidatesWithTheirTimesheets').query({},function (res) {
          var ids = '';
          // var x = ['id1','id2'];
          ids = JSON.stringify(candidatesToPayroll);
          console.log(ids,'\n',runParollWorkers.workers);
          HttpResource.model('timesheets/candidatetimesheets/'+ids).customGet('',{},function (res){
      // body...
          console.log(res);
    
          // body...
          for (var i = 0; i < candidatesToPayroll.length; i++) {
            console.log('im here',candidatesToPayroll[i],res.data.objects[i]);
            $scope.candidatesWithTimesheets.push({id:candidatesToPayroll[i],timesheets:res.data.objects[i]});
            console.log($scope.candidatesWithTimesheets);
          }
          console.log($scope.candidatesWithTimesheets);
          // $scope.candidatesWithTimesheets = res.data.objects;
          $scope.candidatesWithApprovedTimesheets = [];
          var approvedTimesheets = [];
          var timesheetsTotals = 0;
          var totalHours = 0;
          $scope.payrolledTimesheets = [];
          for (i = 0; i < $scope.candidatesWithTimesheets.length; i++) {
            //creating a new property on each object in the array.
        //get timesheets totals in $scope.timesheetsTotals for loop on $scope.candidatesWithTimesheets
        //within the same for loop just add up the timesheets with status of approved; will return $scope.candidatesWithApprovedTimesheets
            for(var j = 0;j<$scope.candidatesWithTimesheets[i].timesheets.length;j++){

            if($scope.candidatesWithTimesheets[i].timesheets[j].status ==='approved'){
              approvedTimesheets.push($scope.candidatesWithTimesheets[i].timesheets[j]);
              timesheetsTotals+= $scope.candidatesWithTimesheets[i].timesheets[j].total;
              totalHours += $scope.candidatesWIthTImesheets[i].timesheets[j].paymentRate.hours;
              $scope.payrolledTimesheets.push({_id:approvedTimesheets[i]._id,status:'payrolled'});
            }
              
            }
            $scope.candidatesWithApprovedTimesheets.push({id:$scope.candidatesWithTimesheets[i].id,
                                                            timesheets:approvedTimesheets,
                                                            timesheetsTotals: timesheetsTotals,
                                                            totalHours: totalHours
                                                          });
            timesheetsTotals = 0;
          }
          console.log($scope.candidatesWithApprovedTimesheets);
          // HttpResource.get('workersWithMargins').query({},function (res) {
            HttpResource.model('users/marginFees/'+ids).customGet('',{},function (res){
      // body...
      console.log(res);
    
            // body... these must return array of the workers of the approved timesheets and their margin scheme
            // ORDER IS TOO DAMN IMPORTANT
            $scope.workersMargins = res.data.objects;
            console.log($scope.workersMargins);
            HttpResource.model('agencies/'+$scope.agency.id+'/marginFee').query({},function (res) {
              // body...
              $scope.agencyMargins = res.data.object;
              console.log($scope.agencyMargins);

              $scope.margins();
        for (i = 0; i < runParollWorkers.workers.length; i++) {
          runParollWorkers.workers[i].margin = $scope.marginsOnWorkers[i];
        }

            });
          });
            
        });
        //http resource get workers margins $scope.workersMargins 
        //http resource get angecy margin; $scope.agencyMargins;
        //function takes $scope.timesheetsTotals to check whether it lies within an interval or not checkPercentage(agency,candidate)//if agency use agency margins if candidate use candidate margins
        ////working after the third call back has responded
   
        
  		HttpResource.model('payroll/run').create(runParollWorkers).post().then(function(response) {
  	    // if(!response.data.result){
          //change payrolled timesheets status' payrolled // WILL USE MOS' API
          // $scope.payrolledTimesheets = [{_id:'54ef3a49a8ca4c5c1649a2e7',status:'approved'}];
          // HttpResource.model('timesheets/update/timesheets').create($scope.payrolledTimesheets).post().then(function (res) {
          //   // body...
          //   console.log(res);
          // })
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
