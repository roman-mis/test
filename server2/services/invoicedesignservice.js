'use strict';
var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
// var _=require('lodash');
var service={};
var queryutils=require('../utils/queryutils')(db);

service.getAllInvoiceDesigns = function(request){
	
	return Q.Promise(function(resolve,reject){
		var q=db.Invoice_Design.find();
		
		queryutils.applySearch(q,db.Invoice_Design,request)
		.then(resolve,reject);

	});

};

service.saveInvoiceDesign = function(invoiceId, invoicedesign){
	// return Q.Promise(function(resolve,reject){
	// 	if(invoiceId == null){
	// 		// Add
	// 		var invoiceDesignModel;
	// 		invoiceDesignModel = new db.Invoice_Design(invoicedesign);
	// 		Q.nfcall(invoiceDesignModel.save.bind(invoiceDesignModel))
	// 		.then(function(){
	// 			resolve({result:true, object:{invoiceDesignModel}});
	// 		},reject);
	// 	}else{
	// 		// Update
	// 		var invoiceDesignModel = agency.branches.id(branchId);
	// 		if(branch){
	// 			utils.updateSubModel(agency.branches.id(branchId), branchInfo);
	// 			Q.nfcall(agency.save.bind(agency))
	// 			.then(function(){
	// 				resolve({result:true, object:{agency:agency, branch: branch}});
	// 			},reject);
	// 		}else{
	// 			reject({result:false,name:'NOTFOUND',message:'Branch not found'});
	// 		}
	// 	}
	// });

	var deff = Q.defer();
	var invoiceDesignModel;
	invoiceDesignModel = new db.Invoice_Design(invoicedesign);
	invoiceDesignModel.save(function(err){
		if(err){
			deff.reject(err);
		}else{
			console.log('save success');
			deff.resolve(invoiceDesignModel);
		}
	});
	return deff.promise;
};

service.getInvoiceDesign=function(id){
	var q=db.Invoice_Design.findById(id);
	return Q.nfcall(q.exec.bind(q));
};

module.exports = service;