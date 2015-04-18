'use strict';
var app = angular.module('origApp.controllers');
app.controller('uploadExpensesCtrl',['$scope', 'HttpResource','$modal','expenses',
	function($scope,HttpResource,$modal,expenses){	


		// console.log($scope.expenses);
		console.log(expenses);
		var expenseElement = {};
		for (var i = 0; i < expenses.length; i++){
			expenseElement.agencyآName = expenses[i][0];
			expenseElement.UserLastName = expenses[i][1];
			expenseElement.userFirstName = expenses[i][2];
			expenseElement.claimDate = expenses[i][3];
			expenseElement.breakFast = expenses[i][4];
			expenseElement.meal1 = expenses[i][5];
			expenseElement.meal2 = expenses[i][6];
			expenseElement.eveningMeal = expenses[i][7];
			expenseElement.Training = expenses[i][8];
			expenseElement.stationary = expenses[i][9];
			expenseElement.others = expenses[i][10];
			console.log(expenseElement);
		}
	}]);
