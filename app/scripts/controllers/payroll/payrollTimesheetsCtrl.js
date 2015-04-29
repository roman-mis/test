'use strict';
angular.module('origApp.controllers')
.controller('payrollTimesheetsCtrl', ['$scope','HttpResource', 'ConstantsResource', 'Notification', '$modal','$rootScope',
	function($scope, HttpResource, ConstantsResource,Notification,$modal,$rootScope){

		$rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
                                  { link: '/payroll/home', text: 'Payroll' },
                                  { link: '/payroll/timesheets', text: 'Timesheets' }
	    ];
		$scope.status = {
  	};

  	$scope.options = {
        currentPage:1,
        limit:20
    };
    var vatRate = 0;
		HttpResource.model('systems/vat').query({}, function (data) {
      var allVatRates = data.data.objects;
      var now = Date.now();
      for (var i = 0; i < allVatRates.length; i++) {
        if(now >= Date.parse(allVatRates[i].validFrom) && now <= Date.parse(allVatRates[i].validTo)  ){
          vatRate = allVatRates[i].amount/100;
          break;
        }
      }
    });

    HttpResource.model('systems/paymentrates').query({}, function (data) {

        $scope.paymentRates = data.data.objects;
        console.log($scope.paymentRates);


    });

		$scope.updateTimesheetsCheked  = function(batchIndex, timesheetIndex, state){
			$scope.timesheetBatches[batchIndex].checked = false;
		};

		$scope.updateBatchCheked = function(batchIndex, state){
  		for(var i = 0; i < $scope.timesheetBatches[batchIndex].timesheets.length; i++){
				$scope.timesheetBatches[batchIndex].timesheets[i].checked = state;
			}
		};

		// $scope.payfrequencies = ConstantsResource.get('payfrequencies');

		HttpResource.model('constants/payfrequencies').customGet('',{},function(payfrequencies){
			$scope.payfrequencies = payfrequencies.data;	
			var all = {
	            'code': '',
	            'description': 'All'
	        };
      $scope.selectedPayfrequency = '';
			$scope.payfrequencies.push(all);
		});

		console.log($scope.payfrequencies);
		
		$scope.filterData = function(){
			$scope.timesheetBatches = angular.copy($scope.rowTimesheetBatches);
			console.log($scope.rowTimesheetBatches);
			var spliceIndexArray = [];
			if($scope.selectedPayfrequency === ''){
				
			}else{
		  	for(var i1 = 0; i1 < $scope.timesheetBatches.length; i1++){
			  	spliceIndexArray = [];
		  		for(var j1 = 0; j1 < $scope.timesheetBatches[i1].timesheets.length; j1++){
						if($scope.timesheetBatches[i1].timesheets[j1].payFrequency !== $scope.selectedPayfrequency){
							spliceIndexArray.push(j1);
						}
					}
					for(var k1 = 0; k1 < spliceIndexArray.length; k1++){
						$scope.timesheetBatches[i1].timesheets.splice(spliceIndexArray[k1]-k1,1);
					}
				}	
			}
			spliceIndexArray = [];
	  	for(var i = 0; i < $scope.timesheetBatches.length; i++){
		  	spliceIndexArray = [];
	  		for(var j = 0; j < $scope.timesheetBatches[i].timesheets.length; j++){
					if($scope.timesheetBatches[i].timesheets[j].status === 'deleted'){
						spliceIndexArray.push(j);
					}
				}
				for(var k = 0; k < spliceIndexArray.length; k++){
					$scope.timesheetBatches[i].timesheets.splice(spliceIndexArray[k]-k,1);
				}
			}
	  	// // generate new data
	  	for(var l = 0; l < $scope.timesheetBatches.length; l++){
	  		generateBatchesData(l);
	  		$scope.updateBatchCheked(l, false);
	  		$scope.timesheetBatches[l].checked = false;
	  	}
		};

    $scope.loadTimesheetBatch = function () {
			var params = {};
			if ($scope.options.limit) {
			  params._limit = $scope.options.limit;
			}
			if ($scope.options.currentPage) {
			    params._offset = ($scope.options.currentPage - 1) * $scope.options.limit;
			}else{
			    params._offset = 0;
			}  

			// if ($scope.filterFirstName) {
			//      params.firstName_contains= $scope.filterFirstName;
			// }
      
      HttpResource.model('timesheetbatches/with/timesheets').query(params, function (timesheetBatches) {
			// HttpResource.model('timesheetbatches/with/timesheets').customGet('',{},function(timesheetBatches){
		  	console.log('timesheets done !!');
		  	console.log(timesheetBatches);
		  	$scope.rowTimesheetBatches = timesheetBatches.data.objects.timesheetBatches;
		  	$scope.options.totalItems = timesheetBatches.data.objects.totalCount;
      	$scope.filterData();
		  	//splice timesheets of type deleted
  			console.log(timesheetBatches);
			});
   	};

    $scope.loadTimesheetBatch();

		function generateBatchesData(index){
			$scope.timesheetBatches[index].total =0;
			$scope.timesheetBatches[index].gross =0;
			$scope.timesheetBatches[index].vat =0;
			for(var i = 0; i < $scope.timesheetBatches[index].timesheets.length; i++){
				generateTimesheetData(index,i);
				$scope.timesheetBatches[index].total += $scope.timesheetBatches[index].timesheets[i].total;
				$scope.timesheetBatches[index].gross +=$scope.timesheetBatches[index].timesheets[i].net;
				$scope.timesheetBatches[index].vat +=$scope.timesheetBatches[index].timesheets[i].vat;
			}
		}


		function generateTimesheetData(batchIndex, timesheetIndex){

			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].total = 0;
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].vat = 0;
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].net = 0;
			for(var i = 0; i < $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements.length; i++){
				generateElementData(batchIndex, timesheetIndex, i);
				$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].total += 
				Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[i].total);
				$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].vat += 
				Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[i].vat);
				$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].net += 
				Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[i].amount);
			
			}
		}

		function generateElementData(batchIndex, timesheetIndex, elementIndex){
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].amount = 
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].units * 
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].payRate;
			
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].vat = 
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].amount * vatRate;

			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].total = 
			Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].amount) +
			Number($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].vat);
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].elementName =
			getElementName($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].elementType);
		}

		function getElementName (id){
			var elementName = '';
			for (var i = 0; i < $scope.paymentRates.length; i++) {
				if($scope.paymentRates[i]._id === id){
					elementName = $scope.paymentRates[i].name;
					break;
				}
			}
			return elementName;
		}

		$scope.finishEditing =function(batchIndex, timesheetIndex, elementIndex, state, payRate, units){
			
					console.log('######');
			if(state){
				if(!payRate){
	        Notification.error({message: 'pay Rate must be Number', delay: 2000});
	        return true;
				}

				if(!units){
	        Notification.error({message: 'units must be Number', delay: 2000});
	        return true;
				}
			}
			if(state === true){
				if(units && payRate){
					for(var key in $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].editData){
						// console.log(key);
						$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex][key] = 
						$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].editData[key] || 
						$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex][key];
					}
					
					generateBatchesData(batchIndex, timesheetIndex, elementIndex);
					var req = {};
					req.reqBody = [];
					var body = {};
					var timesheetsKeys=['_id', 'status', 'net', 'vat', 'total'];
					for(var m = 0; m < timesheetsKeys.length; m++){
						body[timesheetsKeys[m]] = $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex][timesheetsKeys[m]];
					}

					var elementsKeys = ['_id', 'units', 'payRate', 'amount', 'vat', 'description', 'elementType'];
					body.elements =[];
					for(var j = 0; j < $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements.length; j++){
						body.elements[j] ={};
						for(var n = 0; n < elementsKeys.length; n++){
							console.log(elementsKeys[n]);
							// console.log($scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[j]);
							body.elements[j][elementsKeys[n]] = $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[j][elementsKeys[n]];
						}
					}
					console.log(body);

					req.reqBody.push(body);
					console.log(req.reqBody);
					updateServerData(req);
					delete $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].editData;
					return false;			    
				}else{
					return true;
				}
			}else{
				delete $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].elements[elementIndex].editData;
				return false;
			}
		};

		function updateServerData(req){
			HttpResource.model('timesheets/update/timesheets').create(req).post().then(function (response) {
				Notification.success({message: 'Status Changed', delay: 2000});
	   		console.log(response); 	
			});
		}
		$scope.capitalizeFirst = function(s){
			if(!s){
    		return;
    	}
    	var arr = s.split('');
			arr[0] = arr[0].toUpperCase();
    	s = arr.join('');
    	return s;
		};
		function changeStatus(batchIndex, timesheetIndex, status){
			var body = {};
			body._id = $scope.timesheetBatches[batchIndex].timesheets[timesheetIndex]._id;
			body.status = status;
			$scope.timesheetBatches[batchIndex].timesheets[timesheetIndex].status = body.status;
			return body;
		}

		$scope.changeStatusDropDown = function(batchIndex,timesheetIndex,$event){
			$event.preventDefault();
	    $event.stopPropagation();
	    $scope.status.isopen[batchIndex][timesheetIndex] = true;
		};

		$scope.changeStatus = function(batchIndex, timesheetIndex, status){
			if(!status){
				console.log('!!! ' + status);
			}else{
				console.log(status);
				var req = {};
				req.reqBody = [];
				req.reqBody.push(changeStatus(batchIndex, timesheetIndex, status));
				updateServerData(req);
			}
			if(status === 'deleted'){
				$scope.timesheetBatches[batchIndex].timesheets.splice(timesheetIndex,1);
				generateBatchesData(batchIndex);
			}
		};


		$scope.changeSelected = function(batchIndex, status){
			var req = {};
			req.reqBody = [];
			for(var i = 0; i < $scope.timesheetBatches[batchIndex].timesheets.length; i++){
				if($scope.timesheetBatches[batchIndex].timesheets[i].checked === true){
					req.reqBody.push(changeStatus(batchIndex, i, status));
				}
			}
			if(req.reqBody.length>0){
				updateServerData(req);
			}else{
				Notification.error({title:'No selected timesheets to update',message: 'please select timesheet', delay: 3500});
			}
		};

}]);