'use strict';
angular.module('origApp.controllers')
.controller('createInvoiceController', ['$scope','$modalInstance','HttpResource', 'ModalService', 'ConstantsResource',
	function($scope, $modalInstance, HttpResource, ModalService, ConstantsResource){
		
		


		


		

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





		function uniqFast(a) { //getting unique values for agencies with timesheets
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
		HttpResource.model('timesheets').query({},function (response) {
			//console.log(response.data.objects)
			for (var i =0; i< response.data.objects.length; ++i){
				validAgencies.push(response.data.objects[i].agency);	
			}


			$scope.agenciesWithTimesheets=uniqFast(validAgencies);
			$scope.agencies = [];
			
			for(var i = 0; i<$scope.agenciesWithTimesheets.length; ++i){
				HttpResource.model('agencies/' + $scope.agenciesWithTimesheets[i])
				.query({},function (res) {

					$scope.agencies.push({name: res.data.object.name, id: res.data.object._id});
					$scope.displayAgencies = $scope.agencies[0];
					
					// $scope.branches = [];
					// for(var i = 0; i<$scope.agencies.length; ++i){
					// 	$scope.branches.push($scope.agencies[i].branches[i]);
					
					// }
					
					//console.log('agenciessss',$scope.displayBranches)
				});
			}

			console.log('vA',validAgencies);
			console.log('dA', $scope.displayAgencies);

				//$scope.agenciesWithTimesheets=uniq_fast(validAgencies);

			});


		
		$scope.$watch('displayAgencies', function (newVal) {
			if($scope.displayAgencies != null){
				$scope.batchParams = {agency: $scope.displayAgencies.id};
				$scope.batchParams = {
					agency: newVal.id
				};
				$scope.branches = [];
				
				HttpResource.model('agencies/' + $scope.displayAgencies.id).query({},function (res) {
					// body...
					$scope.branches = res.data.object.branches;
					$scope.displayBranches = $scope.branches[0];

				});
				HttpResource.model('timesheetbatches')
				.query($scope.batchParams, function (response) {

					$scope.timeBatches = response.data.objects;
					console.log($scope.timeBatches);
				});
				//console.log(batchParams.agency)

				$scope.paymentTermsConstant = ConstantsResource.get('paymentterms');
				$scope.invoiceDesigns = HttpResource.model('invoicedesigns').query({});
				HttpResource.model('agencies/' + $scope.batchParams.agency + '/payroll')
				.query({},function (payrollResponse) {
					$scope.payrollRes = payrollResponse.data;
					$scope.payroll = payrollResponse.data.object.defaultInvoicing;
					if(payrollResponse.data.object.defaultPayroll.marginChargedToAgency){
						$scope.marginToAgency = payrollResponse.data.object.defaultPayroll.marginChargedToAgency;
					}
					else{
						$scope.marginToAgency = false;
					}
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
				 		$scope.holidayPayOption = 'Yes';
				 	} else {
				 		$scope.holidayPayOption = 'No';
				 	}


				 	
				 	$scope.employersNiIncluded = $scope.payroll.employersNiIncluded;
				 	if(!$scope.payroll.employersNiIncluded){
				 		$scope.employersNiIncluded = false;
				 	}
				 	if ($scope.employersNiIncluded){
				 		$scope.employersNiOption = 'Yes';
				 	} else {
				 		$scope.employersNiOption = 'No';
				 	}



				 	
				 	$scope.invoiceVatCharged = $scope.payroll.invoiceVatCharged;
				 	if(!$scope.payroll.invoiceVatCharged){
				 		$scope.invoiceVatCharged = false;
				 	}
				 	if ($scope.invoiceVatCharged){
				 		$scope.invoiceVatOption = 'Yes';
				 	} else {
				 		$scope.invoiceVatOption = 'No';
				 	}



				 	
				 	$scope.marginChargedToAgency = $scope.marginToAgency;
				 	if(!$scope.marginToAgency){
				 		$scope.marginChargedToAgency = false;
				 	}
				 	if ($scope.marginChargedToAgency){
				 		$scope.marginChargedToAgencyOption = 'Yes';
				 	} else {
				 		$scope.marginChargedToAgencyOption = 'No';
				 	}
				 	

				 	$scope.invoiceDesignArray = [];
				 	$scope.invoiceDesign = $scope.payroll.invoiceDesign;
				 	$scope.invoiceDesignArray.push($scope.invoiceDesign);

				 	for (var i = 0; i < $scope.invoiceDesigns.length; i++) {
				 		$scope.invoiceDesignArray.push($scope.invoiceDesigns[i]);
				 		if($scope.invoiceDesignArray[0]._id === $scope.invoiceDesigns[i]._id){
				 			$scope.invoiceDesignArray.splice(-1);
				 		}
				 	}/////////////////////////////heeeeeeeeeeeeeeeeeerrrrrrrrrre

				 	$scope.invoiceDesignModel = $scope.invoiceDesignArray[0];





				 	$scope.invoiceEmailPrimary = $scope.payroll.invoiceEmailPrimary;
				 	$scope.invoiceEmailSecondary = $scope.payroll.invoiceEmailSecondary;


				 	$scope.paymentTermsArray = [];
				 	$scope.paymentTerms = $scope.payroll.paymentTerms;
				 	$scope.paymentTermsArray.push($scope.paymentTerms);
				 	for(var i = 0; i< $scope.paymentTermsConstant.length; ++i){
				 		$scope.paymentTermsArray.push($scope.paymentTermsConstant[i]);
				 		if($scope.paymentTermsArray[0].code === $scope.paymentTermsConstant[i].code){
				 			$scope.paymentTermsArray.splice(-1);	
				 		}
				 	}
				 	


				 	
				 	console.log('pushhhhhhing');
				 	
				 	
				 	$scope.paymentTermsModel = $scope.paymentTermsArray[0];
				 	

				 	//$scope.paymentTermsModel = $scope.paymentTerms.description($scope.paymentTermsArray[0])
				 	$scope.marginAmount = $scope.payrollRes.object.defaultPayroll.marginAmount;
				 	$scope.holidayAmount = $scope.payrollRes.object.defaultPayroll.holidayAmount;
				 	


				 });
}
});




$scope.clicked = false;
$scope.sendBatch = function (id,index) {
	
			//console.log(id)
			$scope.batchId = id;
			console.log($scope.batchId);
			$scope.selected = index;
		};

		$scope.setHolidayPay = function () {

			if($scope.holidayPayIncluded){
				$scope.holidayPayIncluded = false;
			} else {
				$scope.holidayPayIncluded = true;
			}
		};




		$scope.checkbox = false;
		$scope.proceed = function () {
					//incoming values from the html are strings -_-
					if($scope.marginChargedToAgency === 'false'){
						$scope.marginChargedToAgency = false;
					}
					else{
						$scope.marginChargedToAgency = true;
					}
					if($scope.invoiceVatCharged === 'false'){
						$scope.invoiceVatCharged = false;
					}
					else{
						$scope.invoiceVatCharged = true;
					}
					if(	$scope.employersNiIncluded ==='false'){
						$scope.employersNiIncluded = false;
					}
					else{
						$scope.employersNiIncluded = true;
					}
					if($scope.holidayPayIncluded === 'false'){
						$scope.holidayPayIncluded = false;
					}
					else{
						$scope.holidayPayIncluded = true;
					}

					var invoice = {
						agency:$scope.batchParams.agency,
						branch:null,
						timesheetBatch:$scope.batchId,
						// "date":"2015-01-02",
						// "dueDate":"2015-01-02",
						companyDefaults:{
							holidayPayIncluded:$scope.holidayPayIncluded,
							employersNiIncluded:$scope.employersNiIncluded,
							vatCharged:$scope.invoiceVatCharged,
							invoiceDesign:$scope.invoiceDesignModel,
							marginAmount:$scope.marginAmount,
							invoiceEmailPrimary:$scope.payroll.invoiceEmailPrimary,
							invoiceEmailSecondary:$scope.payroll.invoiceEmailSecondary,
							paymentTerms:$scope.paymentTermsModel.description,
							marginChargedToAgency:$scope.marginChargedToAgency,
							holidayPayDays:$scope.holidayAmount
						}
					};

					
					$scope.posting = true;
					HttpResource.model('invoice').create(invoice).post().then(function (response) {

						console.log('postingggg');
			//$scope.posting = true;
			console.log('the saved invoice',response);
			$scope.saveInvoice = response;
		 	 	// console.log(response);
		 	 	
		 	 	$scope.posting = false;
		 	 	
		 	 	HttpResource.model('invoice').query({},function (res) {
		 	 		console.log('getting all invoices check',res);
		 	 	});

		 	 	
		 	 	
		 	 });



					

			/// close modal instance
			$scope.$watch('posting', function () {
				// body...
				if($scope.posting === false){
					console.log('savedInvoice',$scope.saveInvoice);
					$modalInstance.close();
					//$scope.invoiceOverview = function () {
						
							//open the second modal
							
							ModalService.open({
								templateUrl: 'views/payroll/invoiceOverview.html',
								parentScope: $scope,
								controller: 'invoiceOverviewController',
								size:'md'
							});
						//};
					}
				});
			
		};




		$scope.logMe= function () {
			
		//console.log($scope.displayAgencies)
		//console.log($scope.holidayPayIncluded);
		//console.log($scope.invoiceVatCharged)
		//console.log($scope.logDis);
		//console.log('default logDIs',$scope.logDis)
		//console.log('payrollRes', $scope.payrollRes)
		//console.log('id', $scope.batchId)
		console.log($scope.payroll);
		console.log($scope.invoiceDesignModel);
		console.log('ptermzz',$scope.paymentTermsArray);
		$scope.paymentTermsArray.splice(0,1);
		console.log('ptermzz',$scope.paymentTermsArray);
		console.log('agencies' , $scope.agencies[0]);
		console.log('branches' , $scope.branches);
		console.log('displayBranches', $scope.displayBranches);
		//console.log('margin',$scope.marginChargedToAgency)
	};
















}]);