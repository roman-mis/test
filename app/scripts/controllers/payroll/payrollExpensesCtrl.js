'use strict';
var app = angular.module('origApp.controllers');
app.controller('payrollExpensesCtrl',['$scope','$http',
    function($scope,$http){
    	// console.log(1111111111)
    	$scope.loadAllDate = function(){
    		$http.get('/api/candidates/expenses').success(function (expenses) {
	      	console.log('getting expenses done !!');
	      	console.log(expenses);
	      	$scope.allData = expenses.object.claims;
      	});
    	};
    	$scope.loadAllDate();

    $scope.g = function(d){
    	console.log(d)
    	return d;
    };
    
    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };

    $scope.getWeek = function(d){
    	// console.log(d);
    	var t = (new Date(d)).getWeek();
    	console.log(t);
    	return t;
    };
}]);
