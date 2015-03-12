'use strict';
console.log(1)
var app = angular.module('origApp.controllers');
app.controller('AOEController',['$state', '$rootScope', '$scope', '$modalInstance', 'parentScope', 'HttpResource',
	function($state,$rootScope,$scope,$modalInstance,parentScope,HttpResource){

	$scope.AOETypes = [];
	$scope.priority = [];
	$scope.deductionType = [];
	$scope.AOEData = {};

	$scope.candidate = parentScope.candidate;
	console.log(parentScope.candidate);

	HttpResource.model('constants/AOE').customGet('',{},function(data){
		console.log('AOE');
		console.log(data);
	  $scope.AOETypes = data.data.AOETypes;
	  $scope.priority = data.data.priority;
	  $scope.deductionTypes = data.data.deductionTypes;
	});

	function temp(){
		$scope.AOEData.ProtectedMinimumBroughtForward = 20;
		$scope.AOEData.deductonBroughtForWards = 30;
	}
	temp();

	$scope.selectType = function(type){
		console.log(type);
		var index ;
		for(var i = 0; i < $scope.AOETypes.length; i++){
			if($scope.AOETypes[i].orderType === type ){
				console.log(i);
				console.log($scope.AOETypes[i].orderType);
				index = i;
				$scope.deductionType = $scope.AOETypes[i].deductionType;
				$scope.priorityType =  $scope.AOETypes[i].carriedForward;
				
				// $scope.priorityType;
				break;
			}
		}
		console.log(index);
	};
function getDeductionValue(){
	console.log('getDeductionValue');

	if($scope.deductionType === 'Percentage'){
		return $scope.AOEData.deduction * $scope.AOEData.totalAttachment / 100;
	}else if($scope.deductionType === 'Amount'){
		return $scope.AOEData.deduction;
	}else{
		return 0;
	}
}

function doNoDeduction(attachableValue, deductionValue){
	console.log('doNoDeduction');

	$scope.AOEData.protectedMinimumCarriedForwards = -1 * attachableValue;
	$scope.AOEData.DeductionSoFar 		= 0;
	$scope.AOEData.deductonThisPeriod = 0;

	if($scope.priorityType === 'true'){
		$scope.AOEData.deductonCarriedForwards = $scope.AOEData.deductonBroughtForWards + deductionValue;
	}else{
		$scope.AOEData.deductonCarriedForwards = $scope.AOEData.deductonBroughtForWards;
	}
}

function doDeduction(attachableValue, deductionValue){
	console.log('doDeduction');

	var allDeductions = deductionValue + $scope.AOEData.deductonBroughtForWards;
	$scope.AOEData.protectedMinimumCarriedForwards = 0;
	if(attachableValue > allDeductions){
		$scope.AOEData.deductonCarriedForwards = 0;
		$scope.AOEData.DeductionSoFar 		= allDeductions;
		$scope.AOEData.deductonThisPeriod = allDeductions;
	}else if(attachableValue > deductionValue){
		$scope.AOEData.deductonCarriedForwards 	= $scope.AOEData.deductonBroughtForWards - (attachableValue - deductionValue);	
		$scope.AOEData.DeductionSoFar 					= allDeductions - $scope.AOEData.deductonCarriedForwards;
		$scope.AOEData.deductonThisPeriod 			= allDeductions - $scope.AOEData.deductonCarriedForwards;
	}else{
		if($scope.priorityType === 'true'){
			$scope.AOEData.deductonCarriedForwards = $scope.AOEData.deductonBroughtForWards - (attachableValue - deductionValue);
		}else{
			$scope.AOEData.deductonCarriedForwards = $scope.AOEData.deductonBroughtForWards;
		}
		$scope.AOEData.DeductionSoFar 		= attachableValue;
		$scope.AOEData.deductonThisPeriod = attachableValue;
	}
}

function convertToNumber(){
	$scope.AOEData.protectedValue 					= Number($scope.AOEData.protectedValue);
	$scope.AOEData.deductonCarriedForwards 	= Number($scope.deductonCarriedForwards);
	$scope.AOEData.DeductionSoFar 					= Number($scope.AOEData.DeductionSoFar);
	$scope.AOEData.deductonThisPeriod 			= Number($scope.AOEData.deductonThisPeriod);
	$scope.AOEData.deduction 								= Number($scope.AOEData.deduction);
	$scope.AOEData.totalAttachment 					= Number($scope.AOEData.totalAttachment);
} 

$scope.calculate = function (){
	console.log('calculate');
	convertToNumber();
	console.log($scope.AOEData.protectedValue);
	console.log($scope.AOEData.ProtectedMinimumBroughtForward);
	var allProtectedValue = $scope.AOEData.protectedValue + $scope.AOEData.ProtectedMinimumBroughtForward;
	console.log(allProtectedValue);

	var attachableValue   = $scope.AOEData.totalAttachment - allProtectedValue;
	console.log(attachableValue);
	
	var deductionValue 		= getDeductionValue();

	console.log(deductionValue);

	if(attachableValue < 0){
		doNoDeduction(attachableValue, deductionValue);
	}else{
		doDeduction(attachableValue, deductionValue);
	}
};

$scope.cancel = function() {
  $modalInstance.dismiss('cancel');
};
}]);