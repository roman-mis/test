'use strict';
angular.module('origApp.controllers')
.controller('createInvoiceController', ['$scope','$modalInstance','HttpResource', 'ModalService', 'ConstantsResource',
	function($scope, $modalInstance, HttpResource, ModalService, ConstantsResource){
		$scope.invoiceMethods = ConstantsResource.get('invoicemethods');
    $scope.paymentTerms = ConstantsResource.get('paymentterms');
    HttpResource.model('invoicedesigns').query({},function(data){
    	$scope.invoiceDesigns = [];
    	if(data.data.result === true){
    		$scope.invoiceDesigns = data.data.objects;
    	}
    });

    $scope.selectOptions = [
			{
				value: 'Yes',
				code: true
			},
			{
				value: 'No',
				code: false
			}
		];

HttpResource.model('agencies/with/timesheetBatches').customGet('',{},function(agencies){
  	console.log('agencies done !!');
    console.log(agencies);
    $scope.agencies = agencies.data.objects;
    if($scope.agencies.length > 0){
    	$scope.displayedAgency = $scope.agencies[0]._id;
    	$scope.selectAgency($scope.agencies[0]._id);
    }
	});

		$scope.selectAgency = function(id){
			$scope.timesheetBatches = [];
			for(var i = 0; i < $scope.agencies.length; i++){
				if($scope.agencies[i]._id === id){
					for(var j = 0; j < $scope.agencies[i].timesheetBatches.length; j++){
						// console.log($scope.agencies[i].timesheetBatches[j].status);
						for(var k =0; k < $scope.agencies[i].timesheetBatches[j].status.length; k++){
							console.log($scope.agencies[i].timesheetBatches[j].status[k])
							if($scope.agencies[i].timesheetBatches[j].status[k] == 'preValidation'){
								console.log('%%%%%%%%%%%%%%%%%%%%')
								$scope.timesheetBatches.push($scope.agencies[i].timesheetBatches[j]);
							}	
						}
					}
					$scope.branches = $scope.agencies[i].branches;
					HttpResource.model('agencies/' + id + '/payroll')
					.query({},function (payrollResponse) {
						$scope.defaultInvoicing = payrollResponse.data.object.defaultInvoicing;
						$scope.defaultPayroll = payrollResponse.data.object.defaultPayroll;
					});
					break;
				}
			}
		};

		$scope.clicked = false;
		$scope.sendBatch = function (id,index) {

			$scope.batchId = id;
			$scope.selected = index;
		};

		$scope.setHolidayPay = function () {

			if($scope.holidayPayIncluded){
				$scope.holidayPayIncluded = false;
			} else {
				$scope.holidayPayIncluded = true;
			}
		};



		function getPaymentTerms(){
			for(var i = 0; i < $scope.paymentTerms.length; i++){
				if($scope.defaultInvoicing.paymentTerms.code === $scope.paymentTerms[i].code){
					$scope.defaultInvoicing.paymentTerms = angular.copy($scope.paymentTerms[i]);
					break;
				}
			}
			return $scope.defaultInvoicing.paymentTerms;
		}

		function getInvoiceDesign(){
			for(var i = 0; i < $scope.invoiceDesigns.length; i++){
				if($scope.defaultInvoicing.invoiceDesign._id === $scope.invoiceDesigns[i].code){
					$scope.defaultInvoicing.invoiceDesign = angular.copy($scope.invoiceDesigns[i]);
					break;
				}
			}
			return $scope.defaultInvoicing.invoiceDesign;
		}

		$scope.checkbox = false;
		$scope.proceed = function () {
					
					var invoice = {
						agency:$scope.displayedAgency,
						branch:$scope.displayedBranch,
						timesheetBatch:$scope.batchId,
						companyDefaults:{
							holidayPayIncluded:$scope.defaultInvoicing.holidayPayIncluded,
							employersNiIncluded:$scope.defaultInvoicing.employersNiIncluded,
							vatCharged:$scope.defaultInvoicing.invoiceVatCharged,
							invoiceDesign:getInvoiceDesign(),
							marginAmount:$scope.defaultPayroll.marginAmount,
							invoiceEmailPrimary:$scope.defaultInvoicing.invoiceEmailPrimary,
							invoiceEmailSecondary:$scope.defaultInvoicing.invoiceEmailSecondary,
							paymentTerms:getPaymentTerms().description,
							marginChargedToAgency:$scope.defaultPayroll.marginChargedToAgency,
							holidayPayDays:$scope.defaultPayroll.holidayAmount
						}
					};

			$scope.posting = true;
			console.log(invoice);
			HttpResource.model('invoice').create(invoice).post().then(function (response) {
				console.log(response);
				$scope.saveInvoice = response;
				$modalInstance.close();
					//open the second modal
					ModalService.open({
						templateUrl: 'views/payroll/invoiceOverview.html',
						parentScope: $scope,
						controller: 'invoiceOverviewController',
						size:'md'
					});			
		 		$scope.posting = false;
		 	});
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
}]);