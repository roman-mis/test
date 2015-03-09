'use strict';

angular.module('origApp.controllers')
.controller('MileageController', function($scope, $timeout, $rootScope,HttpResource){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/mileage', text: 'Mileage Rates'}
    ];   
    $scope.$parent.tab = 'mileage';

    $scope.typeSuggestion = [];
    $scope.new={};
    $scope.r = {
    	type:{editeRaw:[]},
    	restriction:{editeRaw:[]},
    	amount:{editeRaw:[]}
    };

    HttpResource.model('/api/systems/mileagerates').customGet('',{},function(data){
    		console.log('mileage');
    		console.log(data);
    });

    $scope.data = [
    {type:'test',restriction:'test restriction',amount:'5'},
    {type:'test',restriction:'test restriction',amount:'5'},
    {type:'test',restriction:'test restriction',amount:'5'},
    {type:'test',restriction:'test restriction',amount:'5'},
    {type:'test',restriction:'test restriction',amount:'5'}
    ];


    $scope.showEdit = function(col,index2){
    	console.log($scope.r[col].editeRaw[index2]);
    	console.log(col);
    	console.log(index2);

    	if($scope.r[col].editeRaw[index2] !== true){
	  		for(var i = 0; i < $scope.data.length; i++){
	    		$scope.r.type.editeRaw[i] =false;
	    		$scope.r.restriction.editeRaw[i] =false;
	    		$scope.r.amount.editeRaw[i] =false;
	    	}
				$scope.r[col].temp = $scope.data[index2][col];
	    	$scope.r[col].editeRaw[index2] =true;
    	}
    	console.log($scope.r[col].editeRaw[index2]);
    };

    function updateTypeSugestion(){
    	var foundFlag = false;
    	$scope.typeSuggestion = [];
    	for(var i = 0; i < $scope.data.length; i++){
    		for(var j = 0; j < $scope.typeSuggestion.length; j++){
    			if($scope.data[i].type === $scope.typeSuggestion[j]){
    				foundFlag = true;
    				break;
    			}
    		}
    		if(foundFlag){
    			foundFlag = false;
    		}else{
    			$scope.typeSuggestion.push($scope.data[i].type);	
    		}
    	}
    	console.log($scope.typeSuggestion);	
    }
    updateTypeSugestion();

    $scope.keyDown = function(col,index2,event){
    	// console.log(event);
    	if(event.keyCode === 13){
    		$scope.data[index2][col] = $scope.r[col].temp;
    		$scope.r[col].editeRaw[index2] =false;
    		updateTypeSugestion();
    	}else if(event.keyCode === 27){
    		$scope.r[col].editeRaw[index2] =false;
	    	$scope.r[col].temp = '';
    	}
    };
    $scope.selectType = function(index,x){
    	$scope.data[index].type = x;
    	$scope.r.type.editeRaw[index]=false;
    	updateTypeSugestion();
    };

    $scope.addRow = function(){
	    $scope.showWarning = false
    	$scope.warning = [];
    	if(!$scope.new.type ||  $scope.new.type === ''){
    		$scope.warning.push('you must enter a type before adding new raw');
    	}
    	if(!$scope.new.restriction ||  $scope.new.restriction === ''){
    		$scope.warning.push('you must enter a restriction before adding new raw');
    		
    	}
    	if(!$scope.new.amount ||  $scope.new.amount === ''){
    		$scope.warning.push('you must enter an amount before adding new raw');
    	}
    	console.log($scope.warning);
    	if($scope.warning.length === 0){
    		$scope.data.push({
    			type: $scope.new.type,
    			restriction: $scope.new.restriction,
    			amount: $scope.new.amount
    		});
    		$scope.new.type = '';
    		$scope.new.restriction='';
    		$scope.new.amount='';
    	}else{
    		$scope.showWarning = true;
    		$timeout(function(){
    			$scope.showWarning = false;
    		},5000);
    	}
    };

    $scope.addNew = function(){
	    $scope.showWarning = false;
    	if(event.keyCode === 13){
	    	$scope.addRow();
    	}
    };
});