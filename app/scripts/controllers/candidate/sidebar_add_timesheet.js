'use strict';
angular.module('origApp.controllers')
.controller('CandidateSidebarAddTimesheetController', function ($scope, $modalInstance, parentScope, HttpResource,$http, params) {


	//getting current candidate from parent scope
	$scope.candidate = parentScope.candidate;

	//getting agencies related to the current candidate
	var _candidateAgencies = HttpResource.model('candidates/' + $scope.candidate._id + '/payrollproduct')
	.query({},function (data) {
		//waiting for the data to return
		$scope.agencies = data.data.objects;
		$scope.saveAgency = $scope.agencies[0];
		console.log('agencies', data.data.objects)


		//console.log('saveagency  ',$scope.saveAgency)

		//must wait for saveAgency model to initialize
		//watching saveAgency to change vat value to the current agency
		$scope.$watch('saveAgency', function (newVal) {
			var _vat = HttpResource.model ('agencies/'+$scope.saveAgency.agency._id+'/payroll');
			_vat.query({},function (data) {
				$scope.isVat = data.data.object.defaultInvoicing.invoiceVatCharged;
			})
		})
	});


	//getting payment rates
	var _rates = HttpResource.model('systems/paymentrates');

	_rates.query({}, function (data) {
		console.log(data.data);
		$scope.paymentRates = data.data.objects;
		$scope.saveRate = $scope.paymentRates[0];
		//$scope.savedRate = $scope.saveRate;
		console.log($scope.paymentRates)

	});
	
	
	var _currentVat = HttpResource.model('systems/vat/current')
	.query({},function (data) {
		
		$scope.currentVat = data.data;

	})


	//user inputs
	$scope.elements = { unit:0	, payRate:0, chargeRate: 'N/A', amount:0, vat:0 };



	$scope.$watch('elements.payRate',function (newVal) {
			$scope.elements.amount = newVal * $scope.elements.unit;	
		
	});	



	$scope.$watch('elements.unit',function (newVal) {
		$scope.elements.amount = $scope.elements.payRate * newVal;
	});




	$scope.$watch('elements.amount', function (newVal) {
		if($scope.isVat == true){
			$scope.elements.vat = newVal * $scope.currentVat.object.amount;	
		}
		else
			$scope.elements.vat = 0;
		
	});



	$scope.userDescription = '';
	$scope.finalElements=[];
	$scope.totalVat = 0;
	$scope.net = 0;
	$scope.total = 0;
	$scope.populateTable = function () {
		
		$scope.tableInfo = {
			elementType: $scope.saveRate.name,
			description: $scope.userDescription,
			units: $scope.elements.unit,
			payRate: $scope.elements.payRate,
			chargeRate: $scope.elements.chargeRate,
			amount: $scope.elements.amount,
			vat: $scope.elements.vat
		}
		
		$scope.finalElements.push($scope.tableInfo);


		$scope.net += $scope.tableInfo.amount;
		$scope.totalVat += $scope.tableInfo.vat;

		$scope.total = $scope.net + $scope.totalVat;
		//console.log('total', $scope.net);
		$scope.userDescription = '';
		$scope.elements.unit = 0;
		$scope.elements.payRate = 0;
		$scope.elements.amount = 0;
		$scope.elements.vat = 0;
		//console.log('table rate',$scope.tableInfo.elementType)
		
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//uploading
		$scope.inSelectFile = false;
		function resetUploadData() {
            $scope.data = {};
          }

          resetUploadData();

          $scope.files = [];

			$scope.onSelectFile = function(fileInput) {
				$scope.inSelectFile = true;
            $scope.$apply(function() {
              $scope.data.documentPath = fileInput.value;
            });
          };
	//upload file to s3
			
          $scope.uploadFile = function() {
          	if($scope.inSelectFile == false)
          		return;
            var file = $('#upload_file')[0].files[0];
            var fileName = new Date().getTime().toString() + '_' + file.name;
            var mimeType = file.type || 'text/plain';
            $scope.isUploading = true;
            HttpResource.model('documents/timesheet').customGet('signedUrl', {
              mimeType: mimeType,
              fileName: fileName
            }, function(response) {
              var signedRequest = response.data.signedRequest;
              $http({
                method: 'PUT',
                url: signedRequest,
                data: file,
                headers: {'Content-Type': mimeType, 'x-amz-acl': 'public-read'}
              }).success(function(data) {
                //get view url of file
                $scope.isUploading = false;
                $scope.data.generatedName = fileName;
                $scope.data.mimeType = mimeType;
                $scope.data.createdDate = moment().toString();
                var newFile = {};
                angular.copy($scope.data, newFile);
                $scope.files = newFile;
                resetUploadData();

              });
            });
          };
		

	//////////////////////////////////////////////////////////////////////////////////////////////////
	//calender


		var currentDate = new Date();
          $scope.minDate = currentDate;
          $scope.claimDate = $scope.claimDate || currentDate;
          $scope.weekEndingDay = 0;
          $scope.clicked= false;
          $scope.$watch('claimDate', function() {
            setTimeout(function() {
              var that = $('#claim_datepicker td > .btn.active.btn-info');
              if (that.length === 1) {
                that.trigger('click');
              }
            }, 100);
          });

          $(document).on('click', '#claim_datepicker td > .btn', function() {
            var that = this;
            $(that).closest('table').find('td > .btn').removeClass('btn-info active');
            $(that).closest('tr').find('td > .btn').addClass('btn-info active');
          });

          $scope.okay = function() {
            var date = $scope.claimDate;
            $scope.claimDateRange = [];
             
            while(date.getDay()!==$scope.weekEndingDay) {
              date = new Date(date.getTime() - 24 * 60 * 60 * 1000); 
            }
              
              
            $scope.claimDateRange[0] = date;
            $scope.claimDateRange[1] = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
            
            var daysInRange = [{object: 'all', label: 'All dates in selection'}];
            var dt = $scope.claimDateRange[0];
            dt.setHours(0, 0, 0, 0);
            for (var i = 0; i < 7; i++) {
              if (dt > $scope.claimDateRange[1]) {
                break;
              }
              daysInRange.push({object: dt, label: moment(dt).format('ddd DD/MM/YYYY')});
              dt = new Date(dt.getTime() + 24 * 3600 * 1000);
              dt.setHours(0, 0, 0, 0);
            }
            $scope.daysInRange = daysInRange;
            $scope.times = [];
            $scope.dateHolder=daysInRange[1].label + " to " + daysInRange[7].label;
            //console.log($scope.daysInRange)
          };

	$scope.cancel = function() {
		if (!confirm('Are you sure you want to cancel?')) {
        return;
      }
		$modalInstance.dismiss('cancel');
	};
	$scope.ok = function() {

		$modalInstance.close();
	};

	$scope.logMe = function () {
		// console.log('agency', $scope.saveAgency.agency._id)
		// console.log('vat',$scope.isVat)
		// console.log('current vat value',$scope.currentVat);
		// console.log('user description', $scope.userDescription)
		//console.log('saveagency  ',$scope.saveAgency.agency.name)
		//console.log($scope.files)
		//console.log($scope.daysInRange)
		 //console.log($scope.res);
		// console.log($scope.elements.unit);
		// console.log($scope.elements.payRate);
		// console.log($scope.elements.amount);
		//console.log($scope.paymentRates[0])
		//console.log('rate',$scope.saveRate)
	}
});