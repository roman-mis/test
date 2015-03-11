'use strict';
angular.module('origApp.controllers')
 .controller('importTimesheetsController', ['$scope', '$modalInstance', 'HttpResource', 'parseCSV', '$http', '$upload',
  	function($scope, $modalInstance, HttpResource, parseCSV, $http,$upload){

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
  			$scope.preProcessChecker = 0;
  			parseCSV.get($files[0]).then(function (response) {
  				console.log(response);
  				$scope.response = response;
  				$scope.addSheet = false;
  				//$scope.preProcess = function () {
				var counter =0;
				for (var i = 0; i < $scope.response.length; i++) {
					if(!$scope.response[i].contractorRefNum || !$scope.response[i].contractorForename ||
					   !$scope.response[i].contractorSurename || $scope.response[i].totalNet<=0){
						$scope.response[i].importStatus = 'Import Fail';
					} else {
						for (var j = 0; j < $scope.response.length; j++) {
							if($scope.response[i].contractorRefNum === $scope.response[j].contractorRefNum){
								counter ++;
								if(counter > 1){
									$scope.duplicate = true;
								}
							}
						}
						counter =0;

						if ($scope.duplicate) {
							$scope.response[i].importStatus = 'Warning';
							$scope.preProcessChecker ++;
							$scope.duplicate = false;
							
						}

						
					}
					if($scope.response[i].importStatus ===''){
						$scope.response[i].importStatus = 'Import Successful';
						$scope.preProcessChecker ++;
					}
					if($scope.response[i].importStatus ==='Import Fail'){
						$scope.preProcessChecker --;
					}

					if($scope.preProcessChecker === $scope.response.length){
						$scope.ready = true;
					}
					else{
						$scope.ready = false;
					}
				}

  				//};

  				$scope.preProcess = function () {
					if($scope.ready){
						$scope.addSheet = true;
					}
					else{
						$scope.addSheet = false;
					}
				};
  				
  			});

  			$scope.$watch('uploadClicked', function () {
  					// body...
  					if($scope.uploadClicked === true){
  						$scope.timesheets = $scope.response;
  						$scope.uploadClicked = false;
  						//$scope.preProcess = false;
  					}
  				});

  			//$scope.$apply();
  		};

  		
  		//console.log('im here now')

  		/*
  			Validation
			Fail
			Agency ID
			Contractor ID
			First Name
			Last Name
			 
			Timesheet value >0.00
			 
			Warning
			Duplicate timesheet
			Above unit amounts
			            	>10 days
			            	>100 hours


  		*/
  		

  			

  		// $scope.onSelectFile = function ($file) {
  		// 	parseCSV.get($file, function (res) {
  		// 		console.log(res);
  		// 		// body...
  		// 	})
  		// }

  		$scope.uploadFile = function () {
  			console.log($scope.files);
	        if ($scope.addSheet) {
	        	var str = $scope.files[0].name;
	        	str = str.replace(/ /g, '_');
	        	var uploadCsv = {
	        		file: $scope.files[0],
	        		timesheettemplate: $scope.saveTemp.code
	        	};
	                /*
	                $upload.upload({
	                    url: 'api/timesheets/uploadcsv',
	                    //fields: {'username': $scope.username},
	                    file: $scope.files[0],
	                    timesheettemplate: $scope.saveTemp.code
	                // }).progress(function (evt) {
	                //     var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	                //     console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
	                }).success(function (data, status, headers, config) {
	                    console.log('file ' + config.file.name + ' uploaded. Response: ' + data);
	                    console.log(data);
	                    $modalInstance.close();
	                });
					*/

		HttpResource.model('timesheets/uploadcsv').create(uploadCsv).post().then(function (res) {
			//console.log(uploadCsv.timesheettemplate);
			console.log('res', res);
		});
				// var fileName = new Date().getTime().toString() + '_' + $scope.files[0].name;
	   //          var mimeType = $scope.files[0].type || 'text/plain';
	   //          $scope.isUploading = true;
	   //          HttpResource.model('documents/timesheets').customGet('signedUrl', {
	   //            mimeType: mimeType,
	   //            fileName: fileName
	   //          }, function(response) {
	   //            var signedRequest = response.data.signedRequest;
	   //            $http({
	   //              method: 'PUT',
	   //              url: signedRequest,
	   //              data: $scope.files[0],
	   //              headers: {'Content-Type': mimeType, 'x-amz-acl': 'public-read'}
	   //            }).success(function() {
	   //              //get view url of file
	   //              $scope.isUploading = false;
	   //              console.log(response.data.signedRequest);

	   //            });
	   //          });
	        }
		};
  		
  		$scope.cancel = function () {
  			$modalInstance.dismiss('cancel');	
  		};
  		$scope.log = function () {
  			console.log($scope.uploadClicked);
  		};
 	
 }]);