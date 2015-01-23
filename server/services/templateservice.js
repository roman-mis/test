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

service.getAllTemplates = function(request){
	
	return Q.Promise(function(resolve,reject){
		var q=db.Template.find();
		
		queryutils.applySearch(q,db.Template,request)
		.then(resolve,reject);

	});

}

service.addTemplate = function(template){
	var deff = Q.defer();
	var templateModel;
	templateModel = new db.Template(template);
	templateModel.save(function(err){
		if(err){
			deff.reject(err);
		}else{
			console.log('save success');
			deff.resolve(templateModel);
		}
	});
	return deff.promise;
}

service.getTemplate=function(id){
	var q=db.Template.findById(id);
	return Q.nfcall(q.exec.bind(q));
}

module.exports = service;