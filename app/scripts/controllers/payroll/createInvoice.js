'use strict';
angular.module('origApp.controllers')
.controller('createInvoiceController', ['$scope','$modalInstance','HttpResource', 
	function($scope, $modalInstance, HttpResource){
		
		var params = {
			agency: '54cbaea74732c9f41ebb16e7'
			// branch: '54cf4bb692f35e88183b639a'
		}


		var invoice = {
						"agency":"54cbaea74732c9f41ebb16e7",
						"branch":"54cf4bb692f35e88183b639a",
						"timesheetBatch":"54de19478a944e9c1cf95464",
						"date":"2015-01-02",
						"dueDate":"2015-01-02",
						"companyDefaults":{
											"holidayPayIncluded":1,
											"employeeNiIncluded":1,
											"vatCharged":1,
											"invoiceDesign":"54d39d472d823bb02d3a4826",
											"marginAmount":123,
											"invoiceEmailPrimary":"test@gmail.com",
											"invoiceEmailSecondary":"test@gmail.com",
											"paymentTerms":"1",
											"marginChargedToAgency":123,
											"holidayAmount":"123"
										}
					}

		HttpResource.model('invoice').create(invoice).post().then(function (response) {

			console.log(response);
		})


		HttpResource.model('invoice').query({},function (response) {

			console.log(response);
		})

		var agencies = {};
		var agency = [];
		HttpResource.model('agencies').query({},function (response) {
			
			 agencies=response.data.objects;
			 console.log('agencies',agencies)

			 for(var i = 0; i<agencies.length; ++i){
			//agency.push(agencies[i]._id);

				HttpResource.model('agencies/' + agencies[i]._id + '/payroll').query({},function (response) {
			
			console.log('agencydata',response.data)
		})
			}
			console.log('agenc', agency)



		})	
		

		


		function uniq_fast(a) {
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
			console.log(response.data.objects)
			for (var i =0; i< response.data.objects.length; ++i){
				validAgencies.push(response.data.objects[i].agency);
			}
			console.log('vA',validAgencies)

			$scope.agenciesWithTimesheets=uniq_fast(validAgencies);

		})





















		
			
	}]);