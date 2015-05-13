'use strict';

var controller = {};
module.exports = function(db){
	var _ = require('lodash'),
	expenseservice = require('../services/expenseservice')(db),
	candidateservice=require('../services/candidateservice')(db),
	systemservice = require('../services/systemservice')(db),
	utils = require('../utils/utils'),
	dataList = require('../data/data_list.json'),
	Q = require('q');
	var enums=require('../utils/enums');


	function getExpenseVm(expense, reload){
		return Q.Promise(function(resolve, reject){
			return systemservice.getSystem()
	  			.then(function(system){
	  				if(system.expensesRate){
	  					if(reload){
							return expenseservice.getExpense(expense._id, true)
				      		.then(function(expense){
				      			var expenseVm = build(expense, system.expensesRate);
				      			resolve(expenseVm);
				      		},reject);
						}else{
							var expenseVm = build(expense, system.expensesRate);
							resolve(expenseVm);
						}
	  				}
	  			}, reject);
		});
	}

	function build(expense){
		var agency = null; if(expense.agency) {agency={_id: expense.agency._id, name: expense.agency.name};}
		var user=expense.user||{};
		var createdBy=expense.createdBy||{};

		// var days = [];
		// _.forEach(expense.days, function(day){
		// 	var expenses = [];
		// 	_.forEach(day.expenses, function(expense){
		// 		var subType = null;
		// 		switch(expense.expenseType.toLowerCase()){
		// 			case 'subsistence':
		// 				subType = utils.findInArray(dataList.MealsList, expense.subType, 'code') || null;
		// 				break;
		// 			case 'transportation':
		// 				subType = utils.findInArray(dataList.TransportationMeans, expense.subType, 'code') || null;
		// 				break;
		// 			case 'other':
		// 				subType = utils.findInArray(dataList.OtherExpenseTypes, expense.subType, 'code') || null;
		// 				break;
		// 		}
		// 		expenses.push({
		// 			expenseType: expense.expenseType,
	 //                subType: subType,
	 //                mileage: expense.mileage,
	 //                value: expense.value,
	 //                text: expense.text,
	 //                description: expense.description,
	 //                receiptUrls: expense.receiptUrls,
		// 		});
		// 	});
		// 	days.push({
		// 		date: day.date,
	 //            startTime: day.startTime,
	 //            endTime: day.endTime,
	 //            postcodes: day.postcodes,
	 //            expenses: expenses
		// 	});
		// });

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

			var pagination=req._restOptions.pagination||{};
	    	var resp={result:true,objects:expensesVms, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:expenses.count}};

			res.json(resp);
		})
		.then(null, res.sendFailureResponse);
	};

	controller.postManyExpenses=function (req, res) {
		var newExpense;
		var request ;
		var promisArray = [];
		console.log(req.body)
		for (var i = 0; i < req.body.expense.length; i++) {
			request = req.body;
			// console.log('requesting');
			// console.log(req.body);
			var expense = req.body.expense[i];
			console.log(i);
			console.log(req.body.ids[i]);
			newExpense = {
				agency: expense.agency,
				user: req.body.ids[i],
				createdBy: req.user.id,
				startedDate: new Date(),
				submittedDate: new Date(),
				source: request.source,
				days: expense.days
			};
			console.log(newExpense);
			promisArray.push(expenseservice.saveExpenses(newExpense));
		}

		//expense total
		// var total = 0;
		// expense.days.forEach(function(day){
		// 	day.expenses.forEach(function(ex) {
		// 		total = total + ex.value*ex.amount;
		// 	});
		// });
console.log('promisArray *****',promisArray.length)
		Q.all(promisArray)
		.then(function(response){
			res.json(response);
		},function(err){
		 	res.sendFailureResponse(err);
		});
	};

	controller.postExpense=function (req, res) {
		var request = req.body;
		console.log('requesting');
		console.log(req.body);
		var expense = request.expense;

		var newExpense = {
			agency: expense.agency,
			user: req.params.id,
			createdBy: req.user.id,
			startedDate: new Date(),
			submittedDate: new Date(),

			source: request.source,
			days: expense.days
		};

		//expense total
		var total = 0;
		expense.days.forEach(function(day){
			day.expenses.forEach(function(ex) {
				total = total + ex.value*ex.amount;
			});
		});


		function saveNewClaim(){
			expenseservice.saveExpenses(newExpense).then(function(response){
				getExpenseVm(response, true)
		    .then(function(_expense){
					candidateservice.updateWorkerCurrentExpensesToUse(req.params.id, total)
					.then(function() {
							res.json(_expense);
					}, function(err){
						res.sendFailureResponse(err);
					});
		        },res.sendFailureResponse);
				},function(err){
				 	res.sendFailureResponse(err);
			});
		}

		
		if(request.vehicleInformation){
			var vehicleInformation = req.body.vehicleInformation;
			candidateservice.updateVehicleInformation(req.params.id, vehicleInformation)
				.then(function(){
					saveNewClaim();
				},function(err){console.log(err);
				 res.sendFailureResponse(err);
			});
		}else{
			saveNewClaim();
		}

	};


	controller.getAllExpenses=function(req,res){
      	var approvedOnly = false;
      	return expenseservice.getAllExpenses(req._restOptions).then(function(expense){
      //		console.log(expense);
     		res.json({result:true,object:expense});
		}).then(null, res.sendFailureResponse);
	};
	controller.rejectExpense=function(req,res){

		expenseservice.changeStatus(enums.expenseStatus.Reject,req.body).then(function(d){
           res.json(d);

		},function(err){

       	res.sendFailureResponse(err);
		});


	};

	controller.setClaimsSubmitted=function(req,res){

		expenseservice.setClaimsSubmitted(req.body).then(function(d){
      res.json(d);
		},function(err){

       	res.sendFailureResponse(err);
		});


	};

	controller.setClaimsRTP = function (req, res) {
	    expenseservice.setClaimsRTP(req.body).then(function (d) {
	        res.json(d);
	    }, function (err) {

	        res.sendFailureResponse(err);
	    });


	};


	controller.getAllApprovedExpenses=function(req,res){
				var approvedOnly = true;
      	return expenseservice.getAllExpenses(req._restOptions,approvedOnly).then(function(expense){
      //		console.log(expense);
     		res.json({result:true,object:expense});
		}).then(null, res.sendFailureResponse);
	};
	controller.rejectExpense=function(req,res){

		expenseservice.changeStatus(enums.expenseStatus.Reject,req.body).then(function(d){
           res.json(d);

		},function(err){

       	res.sendFailureResponse(err);
		});


	};


	controller.approveExpense=function(req,res){
    expenseservice.changeStatus(enums.expenseStatus.Approve,req.body).then(function(d){
           res.json(d);

		},function(err){

       	res.sendFailureResponse(err);
		});

	};
	controller.deleteExpense=function(req,res){
				console.log('%%%%%%%%%%%%%%%%%%%%%1');
				console.log(req.body);
				console.log(req.params);
				console.log(req.expenseIds);

         expenseservice.deleteExpense(req.body.expenseIds).then(function(d){
                  res.json(d);

         },function(err){

         	res.sendFailureResponse(err);
         });

	};
	controller.editExpenses=function(req,res){
				console.log(req.body)
        expenseservice.editExpenses(req.body.body).then(function(d){

               res.json(d);
         },function(err){

           res.sendFailureResponse(err);

         });


	};

  	return controller;
};
