'use strict';

var db = require('../models'),
	Q=require('q'),
	utils=require('../utils/utils'),
	candidatecommonservice=require(__dirname+'/candidatecommonservice')(db);

var service={};

service.getPendingOnboardingDetails=function(userId){
	var q = db.PendingOnboarding.findOne({user: userId});
	return Q.nfcall(q.exec.bind(q));
};

service.removePendingOnboardingDetails=function(userId){
	var q = db.PendingOnboarding.remove({user: userId});
	return Q.nfcall(q.exec.bind(q));
};

service.patchPendingOnboardingDetails = function(userId, pendingOnboardingDetails, complete, historyDetails){
	return Q.Promise(function(resolve,reject){
		candidatecommonservice.getUser(userId)
		   .then(function(user){
		   		if(user){
	   				if(!complete){
	   					// Adding to the pending

	   					service.getPendingOnboardingDetails(userId)
		   				.then(function(pendingOnboardingModel){
		   					
		   					if(pendingOnboardingModel === null){
		   						// Add
		   						pendingOnboardingModel = new db.PendingOnboarding(pendingOnboardingDetails);
		   					}else{
		   						// Edit
		   						utils.updateSubModel(pendingOnboardingModel, pendingOnboardingDetails);
		   					}

		   					return Q.nfcall(pendingOnboardingModel.save.bind(pendingOnboardingModel)).then(function(){
								resolve({object:pendingOnboardingModel});						
							}, reject);
		   				});
	   				}else{
	   					// Remove Onboarding data and add to history
	   					var q = db.PendingOnboarding.remove({user: userId});
 						return Q.nfcall(q.exec.bind(q))
            			.then(function(){ 
            				console.log('success');
            				var historyModel = new db.History(historyDetails);
            				Q.nfcall(historyModel.save.bind(historyModel))
			   					.then(function(){
									resolve({object:historyModel});						
								}, reject);
                  		},function(){
                  			console.log('fail');
                  			// reject;
                      	});
   					}
		   		}
		   		else{
		   			reject({name:'NotFound',message:'No User Found'});
		   		}
		},reject);
	});
};

module.exports=service;