'use strict';
angular.module('origApp.controllers')
.controller('payrollApproveTimesheetsCtrl', ['$scope', '$http', 'HttpResource', 'ConstantsResource', '$rootScope', 'Notification',
	function ($scope, $http, HttpResource, ConstantsResource, $rootScope, Notification) {
	    $rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
                                  { link: '/payroll/home', text: 'Payroll' },
                                  { link: '/payroll/approveTimesheets', text: 'Approve Timesheets' }
	    ];

	    $scope.payfrequencies = ConstantsResource.get('payfrequencies');
	    HttpResource.model('timesheetbatches/with/timesheets').customGet('', {}, function (timesheetBatches) {
	      console.log(timesheetBatches, 'Done!, timesheet batches');
	      $scope.timesheetBatches = timesheetBatches.data.objects.timesheetBatches;
	      $scope.cloned = [];
	      angular.copy($scope.timesheetBatches, $scope.cloned);

	      var spliceIndexArray = [];
		  	for(var i = 0; i < $scope.timesheetBatches.length; i++){
			  	spliceIndexArray = [];
		  		for(var j = 0; j < $scope.timesheetBatches[i].timesheets.length; j++){
						if($scope.timesheetBatches[i].timesheets[j].status !== 'receipted'){
							spliceIndexArray.push(j);
						}
					}
					for(var k = 0; k < spliceIndexArray.length; k++){
						$scope.timesheetBatches[i].timesheets.splice(spliceIndexArray[k]-k,1);
					}
				}

	      for(i = 0; i < $scope.timesheetBatches.length; i++){
	      	if($scope.timesheetBatches[i].timesheets.length === 0){
						$scope.timesheetBatches.splice(i,1);
						i--;
						continue;
	      	}else{
	      		console.log(i)
	  				generateBatchesData(i);
	      		
	      	}
				}

			});


		function generateBatchesData(index){
			$scope.timesheetBatches[index].total =0;
			$scope.timesheetBatches[index].gross =0;
			$scope.timesheetBatches[index].vat =0;
			for(var i = 0; i < $scope.timesheetBatches[index].timesheets.length; i++){
				$scope.timesheetBatches[index].total += $scope.timesheetBatches[index].timesheets[i].total;
				$scope.timesheetBatches[index].gross =$scope.timesheetBatches[index].timesheets[i].net;
				$scope.timesheetBatches[index].vat =$scope.timesheetBatches[index].timesheets[i].vat;
			}
		}

		function updateServerData(req){
			HttpResource.model('timesheets/update/timesheets').create(req).post().then(function (response) {
				Notification.success({message: 'Done !!', delay: 2000});
	   		console.log(response); 	
			});
		}

		function changeStatus(batchIndex, timesheetIndex, status){
			var body = {};
			body._id = $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex]._id;
			body.status = status;
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].status = body.status;
			return body;
		}

		$scope.changeStatus = function(batchIndex, timesheetIndex, status){
			if(!status){
				console.log('!!! ' + status);
			}else{
				console.log(status);
				var req = {};
				req.reqBody = [];
				req.reqBody.push(changeStatus(batchIndex, timesheetIndex, status));
				updateServerData(req);
			}
			if(status !== 'receipted'){
				$scope.timesheetBatches[batchIndex].timesheets.splice(timesheetIndex,1);
				if($scope.timesheetBatches[batchIndex].timesheets.length === 0){
						$scope.timesheetBatches.splice(batchIndex,1);
	      }else{
					generateBatchesData(batchIndex);
	      }
			}
		};


		$scope.changeSelected = function(batchIndex, status){
			var req = {};
			req.reqBody = [];
			for(var i = 0; i < $scope.timesheetBatches[batchIndex].timesheets.length; i++){
				if($scope.timesheetBatches[batchIndex].timesheets[i].checked === true){
					req.reqBody.push(changeStatus(batchIndex, i, status));
				}
			}
			if(req.reqBody.length>0){
				updateServerData(req);
			}else{
				Notification.error({title:'No selected timesheets to update',message: 'please select timesheet', delay: 3500});
			}
		};

		

	}]);