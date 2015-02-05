'use strict';

var db = require('../models'),
	Q=require('q'),
	service={};


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

module.exports = service;