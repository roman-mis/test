'use strict';

var db = require('../models'),
	Q=require('q'),
	queryutils=require('../utils/queryutils')(db);

var service={};

service.getAllInvoiceDesigns = function(request){
	return Q.Promise(function(resolve,reject){
		var q=db.Invoice_Design.find();
		
		queryutils.applySearch(q,db.Invoice_Design,request)
		.then(resolve,reject);
	});
};

service.saveInvoiceDesign = function(invoiceId, invoicedesign){
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