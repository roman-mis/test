'use strict';
angular.module('origApp.controllers')
.controller('payrollTimesheetsCtrl', ['$scope','HttpResource', 'ConstantsResource',
	function($scope, HttpResource, ConstantsResource){
		


		$scope.updateElementsCheked = function(batchIndex, timesheetIndex, elementIndex, state){
			console.log(batchIndex, timesheetIndex, elementIndex, state);
			$scope.timesheetBatches[batchIndex].checked = false;
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].checked = false;
		};

		$scope.updateTimesheetsCheked  = function(batchIndex, timesheetIndex, state){
			$scope.timesheetBatches[batchIndex].checked = false;
			for(var i = 0; i < $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements.length; i++){
				$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[i].checked = state;
			}
		};

		$scope.updateBatchCheked = function(batchIndex, state){
  		for(var i = 0; i < $scope.timesheetBatches[batchIndex].timesheets.length; i++){
				$scope.timesheetBatches[batchIndex].timesheets[i].checked = state;
				for(var j = 0; j < $scope.timesheetBatches[batchIndex].timesheets[i].elements.length; j++){
					console.log(j);
					$scope.timesheetBatches[batchIndex].timesheets[i].elements[j].checked = state;

				}		
			}
			console.log($scope.timesheetBatches[batchIndex]);
		};

		$scope.payfrequencies = ConstantsResource.get('payfrequencies');
		HttpResource.model('timesheetbatches/with/timesheets').customGet('',{},function(timesheetBatches){
  	console.log('agencies done !!');
  	$scope.timesheetBatches = timesheetBatches.data.objects;

  	// generate new data
  	for(var i = 0; i < $scope.timesheetBatches.length; i++){
  		generateBatchesData(i);
  		$scope.updateBatchCheked(i, false);
  		$scope.timesheetBatches[i].checked = false;
  	}
  	console.log(timesheetBatches);
	});

		function generateBatchesData(index){
			$scope.timesheetBatches[index].total =0;
			$scope.timesheetBatches[index].gross =0;
			$scope.timesheetBatches[index].vat =0;
			$scope.timesheetBatches[index].units =0;
			for(var i = 0; i < $scope.timesheetBatches[index].timesheets.length; i++){
				generateTimesheetData(index,i);
				$scope.timesheetBatches[index].total += $scope.timesheetBatches[index].timesheets[i].total;
				$scope.timesheetBatches[index].gross =$scope.timesheetBatches[index].timesheets[i].net;
				$scope.timesheetBatches[index].vat =$scope.timesheetBatches[index].timesheets[i].vat;
			}
		}


		function generateTimesheetData(batchIndex, timesheetIndex){

			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].units = 0;
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].total = 0;
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].vat = 0;
			for(var i = 0; i < $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements.length; i++){
				generateElementData(batchIndex, timesheetIndex, i);
				$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].units += 
				Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[i].units);
				$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].total += 
				Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[i].total);
				$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].vat += 
				Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[i].vat);
			}
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].avgPayRate = 
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].net / $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].units;
		}

		function generateElementData(batchIndex, timesheetIndex, elementIndex){
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].amount = 
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].units * 
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].payRate;
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].total = 
			Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].amount) +
			Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].vat);
		}

		$scope.finishEditing =function(batchIndex, timesheetIndex, elementIndex, state){
			console.log('editing');
			if(state === true){
				for(var key in $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].editData){
					console.log(key);
					$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex][key] = 
					$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].editData[key] || 
					$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex][key];
				}
			}
			delete $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].editData;
			generateBatchesData(batchIndex, timesheetIndex, elementIndex);
		};
		
	}]);