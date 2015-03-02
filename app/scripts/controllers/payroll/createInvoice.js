'use strict';
angular.module('origApp.controllers')
.controller('createInvoiceController', ['$scope','$modalInstance','HttpResource', 'ModalService', 
	function($scope, $modalInstance, HttpResource, ModalService){
		
		var params = {
			agency: '54cbaea74732c9f41ebb16e7'
			// branch: '54cf4bb692f35e88183b639a'
		}


		


		

		// var agencies = {};
		// var agency = [];
		// HttpResource.model('agencies').query({},function (response) {
			
		// 	 agencies=response.data.objects;
		// 	 console.log('agencies',agencies)

		// 	 for(var i = 0; i<agencies.length; ++i){
		// 	//agency.push(agencies[i]._id);

		// 		HttpResource.model('agencies/' + agencies[i]._id + '/payroll').query({},function (response) {
			
		// 	//console.log('agencydata',response.data)
		// })
		// 	}
		// 	console.log('agenc', agency)



		// })	





		function uniq_fast(a) { //getting unique values for agencies with timesheets
			var seen = {};
			var out = [];
			var len = a.length;
			var j = 0;
			for(var i = 0; i < len; i++) {
				var item = a[i];
				if(seen[item] !== 1) {
					seen[item] = 1;
					out[j++] = item;
				}
			}
			return out;
		}

		var validAgencies = [];
		var timesheets = HttpResource.model('timesheets').query({},function (response) {
			//console.log(response.data.objects)
			for (var i =0; i< response.data.objects.length; ++i){
				validAgencies.push(response.data.objects[i].agency);	
			}


			$scope.agenciesWithTimesheets=uniq_fast(validAgencies);
			$scope.agencies = [];
			
			for(var i = 0; i<$scope.agenciesWithTimesheets.length; ++i){
				HttpResource.model('agencies/' + $scope.agenciesWithTimesheets[i])
				.query({},function (res) {

					$scope.agencies.push({name: res.data.object.name, id: res.data.object._id});
					$scope.displayAgencies = $scope.agencies[0];
				})
			}

			console.log('vA',validAgencies);
			console.log('dA', $scope.displayAgencies);

				//$scope.agenciesWithTimesheets=uniq_fast(validAgencies);

		})



		
		$scope.$watch('displayAgencies', function (newVal) {
			if($scope.displayAgencies != null){
				$scope.batchParams = {agency: $scope.displayAgencies.id};
				$scope.batchParams = {
					agency: newVal.id
				}	
				HttpResource.model('timesheetbatches')
				.query($scope.batchParams, function (response) {

					$scope.timeBatches = response.data.objects;
					console.log($scope.timeBatches)
				})
				//console.log(batchParams.agency)


				HttpResource.model('agencies/' + $scope.batchParams.agency + '/payroll')
				 .query({},function (payrollResponse) {
				 	$scope.payrollRes = payrollResponse.data;
				 	$scope.payroll = payrollResponse.data.object.defaultInvoicing;
				 	if(payrollResponse.data.object.defaultPayroll.marginChargedToAgency)
				 		$scope.marginToAgency = payrollResponse.data.object.defaultPayroll.marginChargedToAgency;
				 	else
				 		$scope.marginToAgency = false;
				 	console.log($scope.payroll);

				 	// function turthy (something){
				 	// 	if(something){
				 	// 		something = "Yes";
				 	// 	} else {
				 	// 		something = "No"
				 	// 	}
				 	//}
				 	
				 	$scope.holidayPayIncluded = $scope.payroll.holidayPayIncluded;
				 	if(!$scope.payroll.holidayPayIncluded){
				 		$scope.holidayPayIncluded = false;
				 	}
				 	if ($scope.holidayPayIncluded){
				 		$scope.holidayPayOption = "Yes";
				 	} else {
				 		$scope.holidayPayOption = "No";
				 	}


				 	
				 	$scope.employersNiIncluded = $scope.payroll.employersNiIncluded;
				 	if(!$scope.payroll.employersNiIncluded)
				 		$scope.employersNiIncluded = false;
				 	if ($scope.employersNiIncluded){
				 		$scope.employersNiOption = "Yes";
				 	} else {
				 		$scope.employersNiOption = "No";
				 	}



				 	
				 	$scope.invoiceVatCharged = $scope.payroll.invoiceVatCharged;
				 	if(!$scope.payroll.invoiceVatCharged)
				 		$scope.invoiceVatCharged = false;
				 	if ($scope.invoiceVatCharged){
				 		$scope.invoiceVatOption = "Yes";
				 	} else {
				 		$scope.invoiceVatOption = "No";
				 	}



				 	
				 	$scope.marginChargedToAgency = $scope.marginToAgency;
				 	if(!$scope.marginToAgency)
				 		$scope.marginChargedToAgency = false;
				 	if ($scope.marginChargedToAgency){
				 		$scope.marginChargedToAgencyOption = "Yes";
				 	} else {
				 		$scope.marginChargedToAgencyOption = "No";
				 	}
				 	

				 	$scope.invoiceDesignArray = [];
				 	$scope.invoiceDesign = $scope.payroll.invoiceDesign;
				 	$scope.invoiceDesignArray.push($scope.invoiceDesign)
				 	$scope.invoiceDesignModel = $scope.invoiceDesignArray[0];


				 	$scope.invoiceEmailPrimary = $scope.payroll.invoiceEmailPrimary;
				 	$scope.invoiceEmailSecondary = $scope.payroll.invoiceEmailSecondary;


				 	$scope.paymentTermsArray = [];
				 	$scope.paymentTerms = $scope.payroll.paymentTerms;
				 	$scope.paymentTermsArray.push($scope.paymentTerms)
				 	$scope.paymentTermsModel = $scope.paymentTermsArray[0];



				 	$scope.marginAmount = $scope.payrollRes.object.defaultPayroll.marginAmount;
				 	$scope.holidayAmount = $scope.payrollRes.object.defaultPayroll.holidayAmount;
				 	


				 })
			}
		})
		
		


		$scope.clicked = false;
		$scope.sendBatch = function (id) {
			
			//console.log(id)
			$scope.batchId = id;
			console.log($scope.batchId);
		}

		$scope.setHolidayPay = function () {

			if($scope.holidayPayIncluded){
				$scope.holidayPayIncluded = false;
			} else {
				$scope.holidayPayIncluded = true;
			}
		}




		$scope.checkbox = false;
		$scope.proceed = function () {

					if($scope.marginChargedToAgency == "false")
						$scope.marginChargedToAgency = false;
					else
						$scope.marginChargedToAgency = true;
					if($scope.invoiceVatCharged == "false")
						$scope.invoiceVatCharged = false;
					else
						$scope.invoiceVatCharged = true;
					if(	$scope.employersNiIncluded =="false")
						$scope.employersNiIncluded = false;
					else
						$scope.employersNiIncluded = true;
					if($scope.holidayPayIncluded =="false")
						$scope.holidayPayIncluded = false;
					else
						$scope.holidayPayIncluded = true;

			var invoice = {
						"agency":$scope.batchParams.agency,
						"branch":null,
						"timesheetBatch":$scope.batchId,
						"date":"2015-01-02",
						"dueDate":"2015-01-02",
						"companyDefaults":{
											"holidayPayIncluded":$scope.holidayPayIncluded,
											"employeeNiIncluded":$scope.employersNiIncluded,
											"vatCharged":$scope.invoiceVatCharged,
											"invoiceDesign":$scope.invoiceDesignModel.name,
											"marginAmount":$scope.marginAmount,
											"invoiceEmailPrimary":$scope.payroll.invoiceEmailPrimary,
											"invoiceEmailSecondary":$scope.payroll.invoiceEmailSecondary,
											"paymentTerms":$scope.paymentTermsModel.description,
											"marginChargedToAgency":$scope.marginChargedToAgency,
											"holidayAmount":$scope.holidayAmount
										}
					}

					

		HttpResource.model('invoice').create(invoice).post().then(function (response) {

			console.log('postingggg')
			
		 	console.log('the saved invoice',invoice);
		 	 	// console.log(response);
		 	HttpResource.model('invoice').query({},function (res) {
		 		console.log('getting all invoices check',res)
		 	})

		
			
		})



			

			/// close modal instance
			
			$modalInstance.close();
		}


		$scope.invoiceOverview = function () {
			
			//open the second modal
			ModalService.open({
				templateUrl: 'views/payroll/invoiceOverview.html',
				parentScope: $scope,
				controller: 'invoiceOverviewController',
				size:'lg'
			});
		}

	$scope.logMe= function () {
		
		//console.log($scope.displayAgencies)
		//console.log($scope.holidayPayIncluded);
		//console.log($scope.invoiceVatCharged)
		//console.log($scope.logDis);
		//console.log('default logDIs',$scope.logDis)
		//console.log('payrollRes', $scope.payrollRes)
		//console.log('id', $scope.batchId)
		console.log($scope.holidayPayIncluded);
		//console.log('margin',$scope.marginChargedToAgency)
	}
















}]);