'use strict';
angular.module('origApp.controllers')
 .controller('importTimesheetsController', ['$scope', '$modalInstance', 'HttpResource', '$http', '$upload',
  	function($scope, $modalInstance, HttpResource, $http,$upload){

  		HttpResource.model('agencies').query({}, function (response) {
  			

  			$scope.agency =[];
  			for(var i = 0; i<response.data.objects.length; ++i){
  				$scope.agency.push({id: response.data.objects[i]._id, name:response.data.objects[i].name });
  			}
  			$scope.saveAgency = $scope.agency[0];
  			
  		});

  		HttpResource.model('constants/timesheettemplates').query({},function (response) {
  			$scope.templates = [];
  			console.log(response);
  			for (var i = 0; i < response.data.length; ++i) {
  					$scope.templates.push({code: response.data[i].code, name: response.data[i].name});
  				}	
  				$scope.saveTemp = $scope.templates[0];
  		});

  		$scope.uploadClicked = false;
  		$scope.onSelectFile = function ($files) {
  			console.log('im hereeeee');
  			$scope.files = $files;
  			console.log($files);

  		};
  		$scope.uploadClicked = false;
  		$scope.upload = function  () {
  			$scope.uploadClicked = true;
			$upload.upload({
	            url: 'api/timesheets/uploadcsv',
	            fields: {'timesheettemplate': $scope.saveTemp.code},
	            file: $scope.files[0],
	        
	        }).success(function (data, status, headers, config) {
	            console.log('file ' + config.file.name + ' uploaded. Response: ' + data);
	            console.log(data);
	            $scope.fileUrl = data.url;
	            $scope.timesheets = data.objects;
	            
	        });
  					
  		
  		};
  		$scope.uploadValidation = function () {
  			if($scope.errors === 0 && $scope.preProcessClicked === true && $scope.uploadClicked === true){
  				return true;
  			} else {
  				return false;
  			}
  		};

  		$scope.importStatus = [];
  		$scope.timesheetTable = [];
  		$scope.errors = 0;
  		$scope.preProcessClicked = false;

  		$scope.preProcess = function () {
  			$scope.importStatus = [];
  			$scope.timesheetTable = [];
  			$scope.displayTimesheets = [];
  			$scope.errors = 0;
  			$scope.preProcessClicked = true;
  			console.log('in preProcess');
			for(var i = 0; i< $scope.timesheets.length; ++i){
				console.log('in preProcess loop');
				if($scope.timesheets[i].failMessages.length>0){
					$scope.importStatus[i] = 'Import Fail';
					$scope.errors++;
				}else if($scope.timesheets[i].warningMessages>0){
					$scope.importStatus[i] = 'Warning';
					$scope.errors++;
				} else {
					$scope.importStatus[i] = 'Import Successful';
				}

				$scope.timesheetTable[i] = {
					id: $scope.timesheets[i].contractorReferenceNumber,
					name: $scope.timesheets[i].contractorForename +' '+ $scope.timesheets[i].contractorSurname,
					unit: $scope.timesheets[i].noOfUnits,
					rate: $scope.timesheets[i].payRate,
					total: $scope.timesheets[i].total,
					importStatus: $scope.importStatus[i]

				};


			}
			console.log('out of preProcess loop');
			$scope.displayTimesheets = $scope.timesheetTable;
			console.log('displaySheets ready' ,$scope.displayTimesheets);
			$scope.uploadValidation();
		};

  		
  		function savingBulkSheets () {
  			
	  		var bulkTimesheets = [];
	  		for(var i = 0; i<$scope.timesheets.length;++i){
	  			bulkTimesheets[i] = {
	  				worker: $scope.timesheets[i].worker,
	  				agency: $scope.saveAgency.id,
	  				status: 'submitted',
	  				payFrequency: 'weekly',
	  				weekEndingDate: $scope.timesheets[i].periodEndDate,
	  				net: $scope.timesheets[i].net,
	  				vat: $scope.timesheets[i].vat,
	  				totalPreDeductions:0,
	  				deductions:0,
	  				total: $scope.timesheets[i].total,
	  				imageUrl: 'test_url',
	  				elements: [{
	  					elementType:$scope.timesheets[i].elementType,
	  					units:$scope.timesheets[i].noOfUnits,
	  					payRate:$scope.timesheets[i].payRate,
	  					amout: $scope.timesheets[i].noOfUnits* $scope.timesheets[i].payRate,
	  					vat: ($scope.timesheets[i].noOfUnits* $scope.timesheets[i].payRate * ($scope.timesheets[i].vat)/100).toFixed(2),
	  					isCis:false,
	  					paymentRate:{
	  						name: $scope.timesheets[i].paymentRate.name,
	  						rateType: $scope.timesheets[i].paymentRate.rateType,
	  						hours: $scope.timesheets[i].paymentRate.hours
	  					}

	  				}]


	  			};
	  		}
	  		return bulkTimesheets;
  		}
  		
  		$scope.uploadFile = function () {
  			if(!$scope.errors){
  				console.log($scope.batch);
  				var saveTimesheets = {	
  						filename:$scope.fileUrl,
  						batchNumber:$scope.batch,
  						timesheets: savingBulkSheets()
  					};

  				HttpResource.model('timesheets/bulk').create(saveTimesheets).post().then(function (response) {
  					console.log(saveTimesheets);
  					console.log('this is sparta',response);
  				});


  			}


		};
  		
  		$scope.cancel = function () {
  			$modalInstance.dismiss('cancel');	
  		};
 	
 }]);