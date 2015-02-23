'use strict';
var db 			= require('../../models');
var Q 			= require('q');
var queryutils 	= require('../../utils/queryutils')(db);
var service 	= {};

service.getAllAdminCompanyProfile = function(request){
	console.log('request');
	console.log(request);
	return Q.Promise(function(resolve, reject){
		var q = db.System.find();
		queryutils.applySearch(q,db.System,request)
		.then(resolve, reject);
	});
};

service.saveAdminCompanyProfile = function(companyProfile){
	return Q.Promise(function(resolve,reject){
		var doc = db.System({companyProfile: companyProfile});
		return Q.all([Q.nfcall(doc.save.bind(doc))])
		.then(function(){
			console.log('save done');
			resolve({});
		}, reject);
	});
};

service.editAdminCompanyProfile = function(id, companyProfile){
	return Q.Promise(function(resolve,reject){
		service.getAdminCompanyProfile(id)
		.then(function(doc){
			doc.companyProfile = companyProfile;
			return Q.all([Q.nfcall(doc.save.bind(doc))])
			.then(function(){
				console.log('save done');
				resolve({});
			}, reject);
		});
	});
};

service.deleteAdminCompanyProfile = function(){
	// not implemented yet
	console.log('deleteAdminCompanyProfile');
};

service.getAdminCompanyProfile = function(id){
	var query = db.System.findOne({'_id':id});
	return Q.Promise(function(resolve,reject){
		Q.nfcall(query.exec.bind(query))
		.then(function(doc){
				if(doc){
					resolve(doc);
				}
				else{
					reject({result:false,name:'NOTFOUND',message:'admin template not found'});
				}
			}, reject);
	});
};

module.exports = service;