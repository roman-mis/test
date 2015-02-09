'use strict';
var db = require('../models');
var Q=require('q');
var queryutils=require('../utils/queryutils')(db);
var service = {};


service.saveTemplate = function(templateContent){
	return Q.Promise(function(resolve,reject){
		console.log(templateContent)
		var template = db.adminTemplates(templateContent);
		console.log(template)
		return Q.all([Q.nfcall(template.save.bind(template))])
			.then(function(){
					console.log('save done');
					resolve({});
				},reject);
	});
}


service.getAllAdminTemplates=function(request){
	console.log('request');
	console.log(request);
	return Q.Promise(function(resolve,reject){
		var q=db.adminTemplates.find();
		queryutils.applySearch(q,db.adminTemplates,request)
		.then(resolve,reject);
	});
	
};


service.getAdminTemplate=function(adminTemplateId){
	var query=db.adminTemplates.findOne({'_id':adminTemplateId});
	return Q.Promise(function(resolve,reject){
		Q.nfcall(query.exec.bind(query))
			.then(function(adminTemplate){
				// console.log(agency);
				if(adminTemplate){
					//var agency=branch.agency;
					resolve(adminTemplate);
				}
				else{
					reject({result:false,name:'NOTFOUND',message:'admin template not found'});
				}
			},reject);
	});
};


service.deleteAdminTemplate=function(adminTemplateId){
	return Q.Promise(function(resolve,reject){
		return service.getAdminTemplate(adminTemplateId)
			.then(function(adminTemplate){
					console.log(adminTemplate);
					if(adminTemplate){
						// Get Index
						
						return Q.nfcall(adminTemplate.remove.bind(adminTemplate))
							.then(function(){
								resolve({result:true});
							},reject);
					}else{
						reject({result:false,name:'NOTFOUND',message:'admin template not found'});
					}
				
			},reject);
	});
};

module.exports = service;