var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
var _=require('lodash');
var mailer=require('../mailing/mailer');
var uuid = require('node-uuid');
var url=require('url');
var service={};
var utils=require('../utils/utils');
var awsservice=require('../services/awsservice');
var Schema=require('mongoose').Schema;
var queryutils=require('../utils/queryutils')(db);

service.saveExpenses = function(expenseDetails){
	var deff = Q.defer();
	var expenseModel;
	expenseModel = new db.Expense(expenseDetails);
	console.log(expenseModel);
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