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

service.saveDpa=function(user_id, dpaDetails){
	var historyModel;
	historyModel = new db.History(dpaDetails);
	console.log(historyModel);
	return Q.Promise(function(resolve,reject){
		candidatecommonservice.getUser(user_id)
		   .then(function(user){
		   		if(user){
	   				utils.updateSubModel(user,{dpa_updated_date:dpaDetails.event_date});
					utils.updateSubModel(user,{dpa_updated_by:dpaDetails.history_by});

					return Q.all([Q.nfcall(historyModel.save.bind(historyModel)), Q.nfcall(user.save.bind(user))])
					.then(function(result){
						console.log('here');
						resolve({result:true});
					},reject);
		   		}
		   		else{
		   			reject({name:'NotFound',message:'No User Found'});
		   		}
		},reject);
	});
}

module.exports=service;
