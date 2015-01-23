// 'use strict';

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
var candidatecommonservice=require(__dirname+'/candidatecommonservice');

service.getTaskDetails=function(user_id){
	var q = db.Task.find({user: user_id, task_category: 'TASK'});
	return Q.nfcall(q.exec.bind(q));
}

service.postTaskDetails = function(user_id, taskDetails, historyDetails){
	return Q.Promise(function(resolve,reject){
		candidatecommonservice.getUser(user_id)
		   .then(function(user){
		   		if(user){
	   				var taskModel, historyModel;
					taskModel = new db.Task(taskDetails);
   					historyModel = new db.History(historyDetails);
   					return Q.all([Q.nfcall(taskModel.save.bind(taskModel)), Q.nfcall(historyModel.save.bind(historyModel))])
   					.then(function(result){
						resolve({object:taskModel});						
					}, reject);
	   			}
		   		else{
		   			reject({name:'NotFound', message:'No User Found'});
		   		}
		},reject);
	});
}

service.getCalllogDetails=function(user_id){
	var q = db.Task.find({user: user_id, task_category: 'CALL_LOG'});
	return Q.nfcall(q.exec.bind(q));
}

service.postCalllogDetails = function(user_id, taskDetails, historyDetails){
	return Q.Promise(function(resolve,reject){
		candidatecommonservice.getUser(user_id)
		   .then(function(user){
		   		if(user){
	   				var taskModel, historyModel;
					taskModel = new db.Task(taskDetails);
   					historyModel = new db.History(historyDetails);
   					return Q.all([Q.nfcall(taskModel.save.bind(taskModel)), Q.nfcall(historyModel.save.bind(historyModel))])
   					.then(function(result){
						resolve({object:taskModel});						
					}, reject);
	   			}
		   		else{
		   			reject({name:'NotFound', message:'No User Found'});
		   		}
		},reject);
	});
}

module.exports = service;