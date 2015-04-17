'use strict';
var db = require('../../models');
var Q=require('q');
var queryutils=require('../../utils/queryutils')(db);
var service = {};


service.saveTemplate = function(templateContent){
	return Q.Promise(function(resolve,reject){

		console.log(templateContent);
		var template = db.Template(templateContent);
		console.log(template);

		return Q.all([Q.nfcall(template.save.bind(template))])
			.then(function(){
					console.log('save done');
					resolve({});
				},reject);
	});
};


service.getAllAdminTemplates=function(request){

	return Q.Promise(function(resolve,reject){
		var q=db.Template.find();
		var searchedTextFilter=request.filters['searchedText'];
			if(searchedTextFilter){

				var searchTerm=new RegExp(searchedTextFilter.term,'i');
				q.or([{'name':searchTerm},{'title':searchTerm},{'templateBody':searchTerm},{'templateType':searchTerm},{'subType':searchTerm}]);

				delete request.filters['searchedText'];
			}
		queryutils.applySearch(q,db.Template,request)
		.then(resolve,reject);
	});

};


service.getAdminTemplate=function(adminTemplateId){
	var query=db.Template.findOne({'_id':adminTemplateId});
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
					console.log('i am in the delete');
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



service.updateAdminTemplate=function(adminTemplateId,templateContent){
	return Q.Promise(function(resolve,reject){
		return service.getAdminTemplate(adminTemplateId)
			.then(function(adminTemplate){
					console.log('##########################');
					console.log(adminTemplate);
					if(adminTemplate){
						// var v = ['templateTechnique','templateName','templateType',
						// 	'mergeFields','templatTitle','body'];
							// console.log(v);
						for(var key in templateContent){
							// console.log(adminTemplate[v[i]]);
							// console.log(templateContent[v[i]]);

							adminTemplate[key] = templateContent[key];
						}
						console.log('***********adminTemplate*************');
						console.log(adminTemplate);

						// Get Index
						return Q.all([Q.nfcall(adminTemplate.save.bind(adminTemplate))])
							.then(function(){
								resolve({result:true});
								console.log({result:true});
							},reject);
					}else{
						console.log({result:false});
						reject({result:false,name:'NOTFOUND',message:'admin template not found'});
					}

			},reject);
	});
};

module.exports = service;
