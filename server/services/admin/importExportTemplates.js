'use strict';

var db = require('../../models'),
	Q=require('q'),
	queryutils=require('../../utils/queryutils')(db);

var service = {};

service.getAllTemplates = function(request){
	console.log('in servic');
	return Q.Promise(function(resolve,reject){
		var q=db.importExportTemplates.find();
		queryutils.applySearch(q,db.importExportTemplates,request)
		.then(resolve,reject);
	});

};

service.addTemplate = function(template){
	var deff = Q.defer();
	var templateModel;
	templateModel = new db.importExportTemplates(template);
	templateModel.save(function(err){
		if(err){
			deff.reject(err);
		}else{
			console.log('save success');
			deff.resolve(templateModel);
		}
	});
	return deff.promise;
};

service.getTemplate=function(importExportTemplateId){
	console.log(importExportTemplateId)
	var query=db.importExportTemplates.findOne({'_id':importExportTemplateId});
	return Q.Promise(function(resolve,reject){
		Q.nfcall(query.exec.bind(query))
			.then(function(importExportTemplate){
				// console.log(agency);
				if(importExportTemplate){
					//var agency=branch.agency;
					resolve(importExportTemplate);
				}
				else{
					reject({result:false,name:'NOTFOUND',message:'template not found'});
				}
			},reject);
	});
};

service.deleteTemplate=function(importExportTemplateId){
	return Q.Promise(function(resolve,reject){
		return service.getTemplate(importExportTemplateId)
			.then(function(importExportTemplate){
					console.log(importExportTemplate);
					console.log('i am in the delete');
					if(importExportTemplate){
						// Get Index
						

						return Q.nfcall(importExportTemplate.remove.bind(importExportTemplate))
							.then(function(){
								resolve({result:true});
							},reject);
					}else{
						reject({result:false,name:'NOTFOUND',message:'admin template not found'});
					}
				
			},reject);
	});
}

module.exports = service;