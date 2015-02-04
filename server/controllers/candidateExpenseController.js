'use strict';


module.exports = function(){
	var _=require('lodash');
	var expenseservice=require('../services/expenseservice');
	var controller={};


	controller.getExpense = function(req, res){
		expenseservice.getExpense(req.params.id)
		.then(function(expense){
			res.json({result:true, object: expense});
		}, res.sendFailureResponse);
	};

	controller.postExpenses=function (req, res) {
		// var expense = JSON.parse(req.body.expense);		
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
			user: req.user.id,
			startedDate: new Date(),
			submittedDate: new Date(),
			days: days
		};

		expenseservice.saveExpenses(newExpense).then(function(response){
			res.json({result:true, object:response});
		},function(err){
		 	res.sendFailureResponse(err);
		});
	};
  	return controller;
};
