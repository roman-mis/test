'use strict';

var db = require('../models'),
	Q=require('q'),
	service={};

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