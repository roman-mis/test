'use strict';
var db 			= require('../../models');
var Q 			= require('q');
var queryutils 	= require('../../utils/queryutils')(db);
var service 	= {};
var _=require('lodash');


service.getAllAdminStatutoryRates = function(){
	var q = db.System.findOne();
	return Q.nfcall(q.exec.bind(q));		
};

service.addToAdminStatutoryRates = function(type,opject){
	return Q.Promise(function(resolve,reject){
		var q = db.System.findOne();
		Q.nfcall(q.exec.bind(q))
		.then(function(result){
			console.log('$$$$$$$$$$$$$$$');
			result.statutoryTables[type].push(opject);
			result.save(function(err,res){
				if(err){
					reject(err);
				}
				resolve(res.statutoryTables);
			});
		},reject);
	});
};


service.saveAdminStatutoryRates = function(type,object){
	console.log(type);
	console.log(object);
	return Q.Promise(function(resolve,reject){
		var q = db.System.findOne();
		Q.nfcall(q.exec.bind(q))
		.then(function(result){
			console.log('$$$$$$$$$$$$$$$save');
			result.statutoryTables[type] = object.data;
			result.save(function(err,res){
				if(err){
					reject(err);
				}
				resolve(res.statutoryTables);
			});
		},reject);
	});
};

service.editAdminStatutoryRates = function(id, statutoryRates){
	return Q.Promise(function(resolve,reject){
		service.getAdminStatutoryRates(id)
		.then(function(doc){
			doc.statutoryRates = statutoryRates;
			return Q.all([Q.nfcall(doc.save.bind(doc))])
			.then(function(){
				console.log('save done');
				resolve({});
			}, reject);
		});
	});
};

service.deleteFromAdminStatutoryRates = function(type, id){
	return Q.Promise(function(resolve,reject){
		var q = db.System.findOne();
		Q.nfcall(q.exec.bind(q))
		.then(function(result){
			console.log('$$$$$$$$$$$$$$$');
			_.forEach(result.statutoryTables[type],function(elem,index){
				if(elem._id + '' === id + ''){
					console.log(true)
					result.statutoryTables[type][index].status = 'delete';
					return false;
				}
			});
			result.save(function(err,res){
				if(err){
					reject(err);
				}
				resolve(res.statutoryTables);
			});
		},reject);
	});
};

service.getAdminStatutoryRates = function(id){
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