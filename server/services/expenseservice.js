'use strict';

module.exports = function(dbs){

	var db = dbs,
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
		service={};

	service.getExpenses=function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.Expense.find().populate('agency').populate('user').populate('createdBy');

			queryutils.applySearch(q, db.Expense, request)
				.then(resolve,reject);
		});
	};

	service.getExpense=function(id, populate){
		populate = typeof populate !== 'undefined' ? populate : false;
		var q=db.Expense.findById(id);

		if(populate){
			q.populate('agency');
			q.populate('user');
			q.populate('createdBy');
		}

		return Q.nfcall(q.exec.bind(q));
	};

	service.saveExpenses = function(expenseDetails){
		var deff = Q.defer();
		var expenseModel;
		expenseModel = new db.Expense(expenseDetails);
		expenseModel.save(function(err){
			if(err){
				deff.reject(err);
			}else{
				console.log('save success');
				deff.resolve(expenseModel);
			}
		});
		return deff.promise;
	};

	return service;

};