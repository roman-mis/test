'use strict';
angular.module('origApp.controllers')
.controller('CandidateSidebarAddTimesheetController',
	function ($scope, $modalInstance, parentScope, HttpResource,$http, s3Service) {


	//getting current candidate from parent scope
	$scope.candidate = parentScope.candidate;

	//getting agencies related to the current candidate
	var _candidateAgencies = HttpResource.model('candidates/' + $scope.candidate._id + '/payrollproduct')
	.query({},function (data) {
		//waiting for the data to return
		$scope.agencies = data.data.objects;
		$scope.saveAgency = $scope.agencies[0];

		//must wait for saveAgency model to initialize
		//watching saveAgency to change vat value to the current agency

		$scope.$watch('saveAgency', function (newVal) {
			if($scope.saveAgency == null)
				return;
			var _vat = HttpResource.model ('agencies/'+$scope.saveAgency.agency._id+'/payroll');
			_vat.query({},function (data) {
				$scope.isVat = data.data.object.defaultInvoicing.invoiceVatCharged;
			})
		})
	});


	//getting payment rates
	var _rates = HttpResource.model('systems/paymentrates');

	_rates.query({}, function (data) {

		$scope.paymentRates = data.data.objects;
		$scope.saveRate = $scope.paymentRates[0];
		

	});
	
	
	var _currentVat = HttpResource.model('systems/vat/current')
	.query({},function (data) {
		
		$scope.currentVat = data.data;

	})


	//user inputs
	$scope.elements = { unit:0	, payRate:0, chargeRate: 'N/A', amount:0, vat:0 };


	$scope.$watch('elements.payRate',function (newVal) {

		$scope.elements.amount = Math.round((newVal * $scope.elements.unit)*100)/100;	
		
	});	



	$scope.$watch('elements.unit',function (newVal) {
		$scope.elements.amount = Math.round(($scope.elements.payRate * newVal)*100)/100;
		if(isNaN($scope.elements.amount)){
			$scope.elements.amount = null;
		}
	});




	$scope.$watch('elements.amount', function (newVal) {
		if($scope.isVat == true){
			$scope.elements.vat = Math.round((newVal * $scope.currentVat.object.amount/100)*100)/100;	
		}
		else
			$scope.elements.vat = 0;
		
	});



	$scope.userDescription = '';
	$scope.finalElements=[];
	$scope.totalVat = 0;
	$scope.net = 0;
	$scope.total = 0;
	$scope.addClicked = false;
	$scope.populateTable = function () {
		$scope.addClicked = true;
		$scope.tableInfo = {
			elementType: $scope.saveRate.name,
			description: $scope.userDescription,
			units: $scope.elements.unit,
			payRate: $scope.elements.payRate,
			chargeRate: null,
			amount: $scope.elements.amount,
			vat: $scope.elements.vat
		}
		
		$scope.finalElements.push($scope.tableInfo);


		$scope.net += $scope.tableInfo.amount;
		$scope.net = Math.round($scope.net *100)/100;
		$scope.totalVat += $scope.tableInfo.vat;
		$scope.totalVat = Math.round($scope.totalVat*100)/100;

		$scope.total = $scope.net + $scope.totalVat;
		$scope.total = Math.round($scope.total * 100)/100;
		
		$scope.userDescription = '';
		$scope.elements.unit = 0;
		$scope.elements.payRate = 0;
		$scope.elements.amount = 0;
		$scope.elements.vat = 0;
		
		
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//uploading
	$scope.inSelectFile = false;


	$scope.files = '';
	$scope.uploadedImg = {url:null, name:''};


	$scope.onSelectFile = function(fileInput) {
		$scope.files = fileInput;
		$scope.inSelectFile = true;

		$scope.$apply(function() {

		});
	};
	//upload file to s3

	$scope.uploadFile = function() {

		if($scope.inSelectFile == false){
			return;
		}


		$scope.isUploading = true;

		s3Service.upload({
			fileName: new Date().getTime().toString() + $scope.files.files[0].name,
			file: $scope.files.files[0]

		}).then(function(data) {
			$scope.isUploading = false;
			$scope.uploadedImg.url = data.url;
		}, function() {
			// alert('error');
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

		$scope.weekEndingDate = daysInRange[6];
	};


	
	
	$scope.ok = function() {
		var timesheet = {
			agency: $scope.saveAgency.agency._id,
			worker: $scope.candidate._id,
			weekEndingDate: $scope.weekEndingDate,
			status: 'submitted',
			net:$scope.net,
			vat: $scope.totalVat,
			elements: $scope.finalElements,
			total: $scope.total,
			imageUrl: $scope.uploadedImg.url
		}

		
		HttpResource.model('timesheets').create(timesheet).post()
		.then(function(response) {
			console.log(response)
			// if (HttpResource.flushError(response)) {
			// 	}
			
			
		});
		$modalInstance.close();
	};




	$scope.cancel = function() {
		if (!confirm('Are you sure you want to cancel?')) {
			return;
		}
		$modalInstance.dismiss('cancel');
	};
	
});