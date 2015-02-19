angular.module('origApp.controllers')
.controller('CandidateSidebarAddTimesheetController', function($scope, $modalInstance, parentScope, HttpResource,$http) {


	//getting current candidate from parent scope
	$scope.candidate = parentScope.candidate;

	//getting agencies related to the current candidate
	var _candidateAgencies = HttpResource.model('candidates/' + $scope.candidate._id + '/payrollproduct')
	.query({},function (data) {
		//waiting for the data to return
		$scope.agencies = data.data.objects;
		$scope.saveAgency = $scope.agencies[0];
		console.log('agencies', data.data.objects)


		console.log('saveagency  ',$scope.saveAgency)

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
	var _rates = HttpResource.model('system/paymentrates');

	_rates.query({}, function (data) {
		console.log(data.data);
		$scope.paymentRates = data.data.objects;
		$scope.saveRate = $scope.paymentRates[0];
		//$scope.savedRate = $scope.saveRate;
		console.log($scope.paymentRates)

	});
	
	
	var _currentVat = HttpResource.model('system/vat/current')
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
		console.log('total', $scope.net);
		$scope.userDescription = '';
		$scope.elements.unit = 0;
		$scope.elements.payRate = 0;
		$scope.elements.amount = 0;
		$scope.elements.vat = 0;




		console.log('table rate',$scope.tableInfo.elementType)
		
	}


	$scope.cancel = function() {

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
		console.log('saveagency  ',$scope.saveAgency.agency.name)
		 //console.log($scope.res);
		// console.log($scope.elements.unit);
		// console.log($scope.elements.payRate);
		// console.log($scope.elements.amount);
		//console.log($scope.paymentRates[0])
		//console.log('rate',$scope.saveRate)
	}
});