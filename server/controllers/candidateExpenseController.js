'use strict';


module.exports = function(){
	var expenseservice=require('../services/expenseservice');
	var controller={};

	controller.postExpenses=function (req, res) {
		var expense = JSON.parse(req.body.expense);		
		var newExpense = {
			agency: expense.agency,
			user: req.user.id,
			startedDate: new Date(),
			submittedDate: new Date(),
			days: expense.days || []
		};

		expenseservice.saveExpenses(newExpense).then(function(response){
			res.json({result:true, object:response});
		},function(err){
		 	res.sendFailureResponse(err);
		});
	};
  	return controller;
};
