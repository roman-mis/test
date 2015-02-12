'use strict';

module.exports=function(){
	var db = require('../models'),
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
		utils=require('../utils/utils');

	var service={};

	service.getAllInvoices = function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.Invoice.find().populate('agency').populate('branch');
			queryutils.applySearch(q,db.Invoice,request)
			.then(resolve,reject);
		});
	};

	service.saveInvoice = function(invoiceId, invoice){
		return Q.Promise(function(resolve,reject){
			if(invoiceId === null){
				// Add
				var invoiceModel = new db.Invoice(invoice);
				return Q.nfcall(invoiceModel.save.bind(invoiceModel))
				.then(function(){
						resolve(invoiceModel);
					},reject);
			}else{
				// Edit
				console.log('edit');
				return service.getInvoice(invoiceId)
					.then(function(invoiceModel){
						utils.updateModel(invoiceModel, invoice);
						return Q.nfcall(invoiceModel.save.bind(invoiceModel))
						.then(function(){
								resolve(invoiceModel);
							},reject);
					});
			}
		});
	};

	service.getInvoice=function(id, populate){
		var q=db.Invoice.findById(id);
		if(populate){
			q.populate('agency').populate('branch');
		}

		return Q.nfcall(q.exec.bind(q));
	};

	return service;
};