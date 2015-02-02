'use strict';


module.exports = function(dbs){
	var express = require('express'),
    jwt = require('jsonwebtoken'),
	db = dbs,
	router = express.Router(),
	expenseservice=require('../services/expenseservice'),
	utils=require('../utils/utils'),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	fs=require('fs'),
	path=require('path')
	;
	var awsservice=require('../services/awsservice');

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
			res.json({result:true, object:newExpense});
		},function(err){
		 	res.sendFailureResponse(err);
		});
	}
	
  return controller;
};
