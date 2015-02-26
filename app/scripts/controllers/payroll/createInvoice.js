'use strict';
angular.module('origApp.controllers')
.controller('createInvoiceController', ['$scope','$modalInstance','HttpResource', 
	function($scope, $modalInstance, HttpResource){
		
		var params = {
			agency: '54cbaea74732c9f41ebb16e7'
			// branch: '54cf4bb692f35e88183b639a'
		}
		HttpResource.model('timesheetbatches').query(params,function (response) {
			
			console.log(response);
		})	

	}]);