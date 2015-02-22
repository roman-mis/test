'use strict';

var controller = {};
module.exports = function(){
	var _ = require('lodash'),
	expenseservice = require('../services/expenseservice'),
	candidateservice=require('../services/candidateservice'),
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
		var agency = null; if(expense.agency) {agency={_id: expense.agency._id, name: expense.agency.name};}
		var user=expense.user||{};
		var createdBy=expense.createdBy||{};

		var expenseVm = {
			_id: expense._id,
			claimReference: expense.claimReference,
			agency: agency,
			user: {_id: user._id, firstName: user.firstName, lastName: user.lastName},
			createdBy: {_id: createdBy._id, firstName: createdBy.firstName, lastName: createdBy.lastName},
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
		  	console.log('expensesssss');
		  		// console.log(expenses);
			var pagination=req._restOptions.pagination||{};
	    	var resp={result:true,objects:expensesVms, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:expenses.count}};
			
			res.json(resp);
		})
		.then(null, res.sendFailureResponse);
	};

	controller.postExpense=function (req, res) {	
		var request = req.body;
		var expense = request.expense;

		var newExpense = {
			agency: expense.agency,
			user: req.params.id,
			createdBy: req.user.id,
			startedDate: new Date(),
			submittedDate: new Date(),
			days: expense.days
		};

		//expense total
		var total = 0;
		expense.days.forEach(function(day){
			day.expenses.forEach(function(ex) {
				total = total + ex.value;
			});
		});
		expenseservice.saveExpenses(newExpense).then(function(response){
			getExpenseVm(response, true)
	        .then(function(_expense){
				candidateservice.updateWorkerCurrentExpensesToUse(req.params.id, total)
				.then(function() {
					if(request.vehicleInformation){
						// Adding Vehicle Information
						var vehicleInformation = req.body.vehicleInformation;
						candidateservice.updateVehicleInformation(req.params.id, vehicleInformation)
							.then(function(){
							  res.json(_expense);
							},function(err){console.log(err);
							 res.sendFailureResponse(err);
						});
					}else{
						res.json(_expense);
					}
				}, function(err){
					res.sendFailureResponse(err);
				});
	        },res.sendFailureResponse);
		},function(err){
		 	res.sendFailureResponse(err);
		});
	};
  	return controller;
};
