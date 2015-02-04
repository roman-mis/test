'use strict';

var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
var service={};
var utils=require('../utils/utils');
var candidatecommonservice=require(__dirname+'/candidatecommonservice');

service.saveDpa=function(userId, dpaDetails){
	var historyModel;
	historyModel = new db.History(dpaDetails);
	console.log(historyModel);
	return Q.Promise(function(resolve,reject){
		candidatecommonservice.getUser(userId)
		   .then(function(user){
		   		if(user){
	   				utils.updateSubModel(user,{dpaUpdatedDate:dpaDetails.eventDate});
					utils.updateSubModel(user,{dpaUpdatedBy:dpaDetails.historyBy});

					return Q.all([Q.nfcall(historyModel.save.bind(historyModel)), Q.nfcall(user.save.bind(user))])
					.then(function(){
						console.log('here');
						resolve({result:true});
					},reject);
		   		}
		   		else{
		   			reject({name:'NotFound',message:'No User Found'});
		   		}
		},reject);
	});
};

module.exports=service;
