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
			 var count = 1;
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

				// $scope.timesheetTable[i] = {
				// 	id: $scope.timesheets[i].contractorReferenceNumber,
				// 	name: $scope.timesheets[i].contractorForename +' '+ $scope.timesheets[i].contractorSurname,
				// 	unit: $scope.timesheets[i].noOfUnits,
				// 	rate: $scope.timesheets[i].payRate,
				// 	total: $scope.timesheets[i].total,
				// 	importStatus: $scope.importStatus[i]
				// };

        for(var j = 0; j< $scope.timesheets[i].elements.length; j++){
            var timesheetRow = {};
            timesheetRow.id = count++;
            timesheetRow.contractorReferenceNumber = $scope.timesheets[i].contractorReferenceNumber;
            timesheetRow.name = $scope.timesheets[i].contractorForename +' '+ $scope.timesheets[i].contractorSurname;
            timesheetRow.importStatus = $scope.importStatus[i];
            timesheetRow.unit = $scope.timesheets[i].elements[j].units;
            timesheetRow.rate = $scope.timesheets[i].elements[j].payRate;
            timesheetRow.total = $scope.timesheets[i].elements[j].units*$scope.timesheets[i].elements[j].payRate;
            timesheetRow.paymentRate = $scope.timesheets[i].elements[j].rateDescription;
            $scope.timesheetTable.push(timesheetRow);
        }

			}
      console.log('out of preProcess loop');
			$scope.displayTimesheets = $scope.timesheetTable;
			console.log('displaySheets ready' ,$scope.displayTimesheets);
			$scope.uploadValidation();
		};

  		
  		function savingBulkSheets () {
  			
	  		var bulkTimesheets = [];
	  		for(var i = 0; i<$scope.timesheets.length;++i){
	  			var elements = [];
          for(var j = 0; j< $scope.timesheets[i].elements.length; j++){
            var vat = $scope.timesheets[i].elements[j].noOfUnits * $scope.timesheets[i].payRate * $scope.timesheets[i].elements[j].vat;
            vat = vat ? vat/100 : 0;
            var element={
              elementType:$scope.timesheets[i].elements[j].elementType,
              units:$scope.timesheets[i].elements[j].noOfUnits,
              payRate:$scope.timesheets[i].elements[j].payRate,
              amout: $scope.timesheets[i].elements[j].noOfUnits* $scope.timesheets[i].elements[j].payRate,
              vat: vat,
              isCis:false,
              paymentRate:$scope.timesheets[i].elements[j].paymentRate
            };
            elements.push(element);
          }

          bulkTimesheets[i] = {
	  				worker: $scope.timesheets[i].worker,
	  				agency: $scope.saveAgency.id,
	  				status: 'submitted',
	  				weekEndingDate: $scope.timesheets[i].periodEndDate,
	  				net: $scope.timesheets[i].net,
	  				vat: $scope.timesheets[i].vat,
	  				total: $scope.timesheets[i].total,
	  				elements: elements
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
  				});


  			}


		};
  		
  		$scope.cancel = function () {
  			$modalInstance.dismiss('cancel');	
  		};
 	
 }]);