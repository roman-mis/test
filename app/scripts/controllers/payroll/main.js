var app = angular.module('origApp.controllers');

app.controller('PayrollMainController',['$location', '$rootScope', '$scope', 'HttpResource',
	function($location,$rootScope,$scope,HttpResource){	
		console.log('hello');
	$scope.payroll = {};
	$scope.allPayrolls = [];
	$scope.agencyIndex = -1;
	$scope.comparingList = [];
	$scope.camelCaseFormate = function(s){
    	var ar = s.split(' ');
    	s = '';
    	for(var i = 0; i< ar.length; i++){
    		var arr = ar[i].split('');
    		if(i === 0){
    			arr[0] = arr[0].toLowerCase();
    		}else{
				arr[0] = arr[0].toUpperCase();
    		}
    		s = s+ arr.join('');
    	}
    	return s;
    }

    $scope.unCamelCaseFormate = function(s){
    	if(!s || s.length === 0){
    		return s;
    	}	
    	var ar = s.split('');
    	s = ar[0].toUpperCase();
    	for(var i = 1; i < ar.length; i++){
    		if(ar[i] === ar[i].toUpperCase()){
    			s += ' ';
    		}
    		s += ar[i]
    	}
    	return s;
    }

    HttpResource.model('payroll').customGet('',{},function(data){
      	console.log('done !!');
        console.log(data.data.objects);
        $scope.allPayrolls = data.data.objects;
        $scope.payroll =  $scope.allPayrolls[0];
        console.log($scope.payroll.agencies)
	});

    $scope.selectAgency = function(index){
    	$scope.agencyIndex = index;
    }

    $scope.addAgency = function(index){
    	$scope.comparingList.push(index);
    }

    $scope.getAgencyData = function(index){
    	console.log('index >>'+index)
    	if(!$scope.payroll.agencies || !$scope.payroll.agencies[index]){
    		return
    	}
    	var data = {};
    	for(key in $scope.payroll.agencies[index]){
    		if(key === 'agency'){
    			continue;
    		}
    		data[key] = $scope.payroll.agencies[index][key];
    	}
    	return data;
    }
	
	$scope.viewAction = function(){
		$scope.viewAll = ! $scope.viewAll;		
	}
	

	$scope.checkUncheck = function(index){
		$scope.agencyCheckListValues[$scope.camelCaseFormate($scope.agencyCheckListLabels[index])] = !		
		$scope.agencyCheckListValues[$scope.camelCaseFormate($scope.agencyCheckListLabels[index])]		
	}


}]);



