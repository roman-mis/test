'use strict';

var controller = {};
module.exports = function(){
	var _ = require('lodash'),
	expenseservice = require('../services/expenseservice'),
	Q = require('q');

	function getExpenseVm(expense, reload){
		return Q.Promise(function(resolve, reject){
			function build(expense){
				var expenseVm = {
					agency: {_id: expense.agency._id, name: expense.agency.name},
					user: {_id: expense.user._id, firstName: expense.user.firstName, lastName: expense.user.lastName},
					createdBy: {_id: expense.createdBy._id, firstName: expense.createdBy.firstName, lastName: expense.createdBy.lastName},
					startedDate: expense.startedDate,
		        	submittedDate: expense.submittedDate,
		        	days: expense.days
				};
				resolve({result:true, object: expenseVm});
			}

			if(reload){
				return expenseservice.getExpense(expense._id, true)
	      		.then(function(expense){
	      			build(expense);
	      		},reject);
			}else{
				build(expense);
			}
		});
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

	

	controller.postExpenses=function (req, res) {	
		var expense = req.body;		
		var days = [];
		_.forEach(expense.days, function(day){
			
			var exps = [];
			_.forEach(day.expenses, function(_expense){
				var e = {
					type: _expense.type,
					subType: _expense.subType,
					value: _expense.value,
					description: _expense.description,
					receiptUrls: _expense.receiptUrls
				};
				exps.push(e);
			});

			var _day = {
				date: day.date,
				startTime: day.startTime,
				endTime: day.endTime,
				expenses: exps,
			};
			days.push(_day);
		});

		var newExpense = {
			agency: expense.agency,
			user: req.params.id,
			createdBy: req.user.id,
			startedDate: new Date(),
			submittedDate: new Date(),
			days: days
		};

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
