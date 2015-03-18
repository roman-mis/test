'use strict';
var app = angular.module('origApp.controllers');

app.controller('addNewImExTemplatesController',['$rootScope', '$scope','$state','$stateParams','HttpResource', 'imExTemplates',
	function($rootScope,$scope,$state,$stateParams,HttpResource,imExTemplates){
		var fields = ['templateType', 'templateName', 'items'];
console.log($stateParams);
		var valideTypes = ['Schedule','Expenses','Contractor','Assignment','BACS','Invoices'];
		$scope.items =[];
		
		if($stateParams.type === 'Edit'){
			console.log(imExTemplates);

			$scope.templateType = imExTemplates.details.templateType;
			console.log($scope.templateType);
			$scope.templateName = imExTemplates.details.templateName;
			$scope.items = imExTemplates.details.items;
			imExTemplates.details = {};

		}else{
			var invalidetype = true;
			for(var i = 0; i < valideTypes.length; i++){
				if(valideTypes[i] === $stateParams.type){
					invalidetype = false;
					break;
				}
			}
			if(invalidetype){
				$state.go('app.admin.Import&Export');
			}

			$scope.templateType = $stateParams.type;
		}

        
        $scope.removeItem = function(index) {
            $scope.items.splice(index, 1);
        };

        $scope.paste = function(){
        	if(imExTemplates.details.items){
        		$scope.items = imExTemplates.details.items;
        	}
        };
        
        $scope.sortableOptions = {};
        
        $scope.options = [
            {group: 'Candidate Data', label: 'Candidate ID', value: '1'},
            {group: 'Candidate Data', label: 'Agency ID', value: '2'},
            {group: 'Candidate Data', label: 'First Name', value: '3'},
            {group: 'Candidate Data', label: 'Last Name', value: '4'},
            {group: 'Candidate Data', label: 'Description', value: '5'},
            {group: 'Candidate Data', label: 'Location', value: '6'},
            {group: 'Candidate Data', label: 'Start Time', value: '7'},
            {group: 'Candidate Data', label: 'End Time', value: '8'},
            {group: 'Pay Rates Table', label: 'Pay Rate / Rate', value: '10'},
            {group: 'Pay Rates Table', label: 'Charge Rate', value: '11'},
            {group: 'Pay Rates Table', label: 'Deductions', value: '12'},
            {group: 'Pay Rates Table', label: 'Billable Expenses', value: '13'},
            {group: 'Pay Rates Table', label: 'Holiday Pay', value: '14'},
            {group: 'Pay Rates Table', label: 'Over Time Pay Rate Rate', value: '15'},
            {group: 'Pay Rates Table', label: 'Over Time Charge Rate', value: '16'},
            {group: 'Gross', label: 'Gross', value: '17'},
            {group: 'VAT', label: 'VAT', value: '18'},
            {group: 'Total', label: 'Total', value: '19'}
        ];
        
        $scope.optList = $scope.options[0];
        
        $scope.add = function(selectedOption) {
            var l = $scope.items.length;
            while (l--) {
                if ($scope.items[l] === selectedOption) {
                    window.alert('Item is already added');
                    return false;
                }
            }
            $scope.items.push(selectedOption);
            console.log($scope.items);
        };

        $scope.isNotEmpty = function(fields){
			var isNotEmpty = true;
			for(var i = 0; i < fields.length; i++){
				console.log(fields[i]);
				if($scope[fields[i]] === undefined || $scope[fields[i]] === ''){
					isNotEmpty = false;
					break;
				}
			}
			return isNotEmpty;
		};

        $scope.getData = function(fields){
			var data = {};
			for(var i = 0; i < fields.length; i++){
				data[fields[i]] = $scope[fields[i]];
			}
			return data;
		};

        $scope.saveNew = function(){
			if($scope.isNotEmpty(fields)){
				var data = $scope.getData(fields);
				console.log(data);
				HttpResource.model('imExTeplates').create(data).post().then(function(response) {
	              if (!HttpResource.flushError(response)) {
	                $scope.clear();
	                console.log(response);
	              }
	            });
			}
		};

		$scope.close = function(){
			$state.go('app.admin.Import&Export');
		};
}]);