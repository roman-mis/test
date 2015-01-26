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

service.getPendingOnboardingDetails=function(userId){
	var q = db.Pending_Onboarding.findOne({user: userId});
	return Q.nfcall(q.exec.bind(q));
}

service.removePendingOnboardingDetails=function(userId){
	var q = db.Pending_Onboarding.remove({user: userId});
	return Q.nfcall(q.exec.bind(q));
}

service.patchPendingOnboardingDetails = function(userId, pendingOnboardingDetails, complete, historyDetails){
	return Q.Promise(function(resolve,reject){
		candidatecommonservice.getUser(userId)
		   .then(function(user){
		   		if(user){
	   				if(!complete){
	   					// Adding to the pending
	   					var pendingOnboardingModel;
		   				service.getPendingOnboardingDetails(userId)
		   				.then(function(pendingOnboardingModel){
		   					
		   					if(pendingOnboardingModel == null){
		   						// Add
		   						pendingOnboardingModel = new db.Pending_Onboarding(pendingOnboardingDetails);
		   					}else{
		   						// Edit
		   						utils.updateSubModel(pendingOnboardingModel, pendingOnboardingDetails);
		   					}

		   					return Q.nfcall(pendingOnboardingModel.save.bind(pendingOnboardingModel)).then(function(result){
								resolve({object:pendingOnboardingModel});						
							}, reject);
		   				});
	   				}else{
	   					// Remove Onboarding data and add to history
	   					var q = db.Pending_Onboarding.remove({user: userId});
 						return Q.nfcall(q.exec.bind(q))
            			.then(function(){ 
            				console.log('success');
            				historyModel = new db.History(historyDetails);
            				Q.nfcall(historyModel.save.bind(historyModel))
			   					.then(function(result){
									resolve({object:historyModel});						
								}, reject);
                  		},function(err){
                  			console.log('fail');
                  			reject;
                      	});
   					}
		   		}
		   		else{
		   			reject({name:'NotFound',message:'No User Found'});
		   		}
		},reject);
	});
}

module.exports=service;