'use strict';
angular.module('origApp.controllers')
.controller('receiptFundsCtrl', ['$scope','$modalInstance','HttpResource', 'ModalService', 'ConstantsResource',
	function($scope, $modalInstance, HttpResource, ModalService, ConstantsResource){
	
	var allInvoices = [];
	$scope.agencyInvoices = [];
	$scope.selectedInvoices = [];
	$scope.acceptedValue = [];
	$scope.agencies = [];
	HttpResource.model('invoice').customGet('',{},function(invoices){
  	console.log('invoices done !!');
    console.log(invoices);
    allInvoices = invoices.data.objects;
    invoices.data.objects.forEach(function(invoice){
    	var found = false;
    	for(var i = 0; i < $scope.agencies.length; i++){
    		if($scope.agencies[i].name === invoice.agency.name){
    			found = true;
    			break;
    		}
    	}
  		if(!found){
  			$scope.agencies.push({name:invoice.agency.name,id:invoice.agency._id});
  		}
    });

    $scope.selectedAgencyId = $scope.agencies[0].id;
    $scope.getAgencyInvoices($scope.selectedAgencyId);
	});

	$scope.getAgencyInvoices = function(id){
		allInvoices.forEach(function(invoice){
			if(invoice.agency._id === id  && invoice.status === 'created'){
				$scope.agencyInvoices.push(invoice);
				$scope.selectedInvoices.push(false);
				$scope.acceptedValue.push('');
			}
		});
		console.log($scope.agencyInvoices);
	};

	$scope.disableButton = function(){
		var disable = false;
		if($scope.selectedInvoices.length > 0){
			disable = false;
		}

		for(var i = 0; i < $scope.selectedInvoices.length; i++){
			if($scope.selectedInvoices[i] === true){
				if(Number($scope.acceptedValue[i]) !== Number($scope.agencyInvoices[i].total)){
					disable = true;
					break;
				}
			}
		}
		return disable;
	};

	$scope.markAsReceived = function () {
		var req = {};
		var reqBody = [];
		for(var i = 0; i < $scope.selectedInvoices.length; i++){
			if($scope.selectedInvoices[i] === true){
				reqBody.push({
					id: $scope.agencyInvoices[i]._id
				});
			}
		}
		req.reqBody = reqBody;
		HttpResource.model('invoice/receiveInvoices').create(req).post().then(function(res){
			console.log('Done !');
			console.log(res);
			$scope.cancel();
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);
