 'use strict';


module.exports=function(dbs){

	var db = dbs;
	var Q=require('q');
	// var Promise=require('promise');
	
	var candidatecommonservice=require(__dirname+'/candidatecommonservice');

	var service={};
	
	service.getTaskDetails=function(userId){
		var q = db.Task.find({user: userId, taskCategory: 'TASK'});
		return Q.nfcall(q.exec.bind(q));
	};

	service.postTaskDetails = function(userId, taskDetails, historyDetails){
		return Q.Promise(function(resolve,reject){
			candidatecommonservice.getUser(userId)
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
	};

	service.getCalllogDetails=function(userId){
		var q = db.Task.find({user: userId, taskCategory: 'CALL_LOG'});
		return Q.nfcall(q.exec.bind(q));
	};

	service.postCalllogDetails = function(userId, taskDetails, historyDetails){
		return Q.Promise(function(resolve,reject){
			candidatecommonservice.getUser(userId)
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
	};

	return service;
};