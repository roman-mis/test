'use strict';

var controller = {};
module.exports = function(){
	var _ = require('lodash'),
	expenseservice = require('../services/expenseservice'),
	Q = require('q');

	function getExpenseVm(expense, reload){
		return Q.Promise(function(resolve, reject){
			if(reload){
				return expenseservice.getExpense(expense._id, true)
	      		.then(function(expense){
	      			var expenseVm = build(expense);
	      			resolve({result:true, object: expenseVm});
	      		},reject);
			}else{
				build(expense);
			}
		});
	}

	function build(expense){
		var expenseVm = {
			_id: expense._id,
			agency: {_id: expense.agency._id, name: expense.agency.name},
			user: {_id: expense.user._id, firstName: expense.user.firstName, lastName: expense.user.lastName},
			createdBy: {_id: expense.createdBy._id, firstName: expense.createdBy.firstName, lastName: expense.createdBy.lastName},
			startedDate: expense.startedDate,
	    	submittedDate: expense.submittedDate,
	    	days: expense.days
		};
		return expenseVm;
	}

	controller.getExpense = function(req, res){
		expenseservice.getExpense(req.params.id, true)
		.then(function(expense){

			getExpenseVm(expense, false)
	        .then(function(_expense){
          		res.json(_expense);
	        },res.sendFailureResponse);

		}, res.sendFailureResponse);
	};

	controller.getExpenses = function(req, res){
		return expenseservice.getExpenses(req._restOptions)
		.then(function(expenses){
			var expensesVms = [];
		  	_.forEach(expenses.rows, function(_expense){
		  		var expense = build(_expense);
		  		expensesVms.push(expense);
			});

			var pagination=req._restOptions.pagination||{};
	    	var resp={result:true,objects:expensesVms, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:expenses.count}};
			
			res.json(resp);
		}, res.sendFailureResponse);
	};

	controller.postExpense=function (req, res) {	
		var expense = req.body;
		
		var newExpense = {
			agency: expense.agency,
			user: req.params.id,
			createdBy: req.user.id,
			startedDate: new Date(),
			submittedDate: new Date(),
			days: expense.days
		};
		console.log(newExpense);

		expenseservice.saveExpenses(newExpense).then(function(response){
			getExpenseVm(response, true)
	        .then(function(_expense){
          		res.json(_expense);
	        },res.sendFailureResponse);
		},function(err){
		 	res.sendFailureResponse(err);
		});
	};
  	return controller;
};
