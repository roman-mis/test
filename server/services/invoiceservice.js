'use strict';

module.exports=function(){
	var db = require('../models'),
		Q=require('q'),
		_=require('lodash'),
		queryutils=require('../utils/queryutils')(db),
		utils=require('../utils/utils'),
		timesheetservice=require(__dirname+'/timesheetservice')(),
		systemservice=require(__dirname+'/systemservice')();

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
				return timesheetservice.getTimesheetsByBatchId(invoice.timesheetBatch)
				.then(function(timesheets){
					
					var lines = [];
					var net = 0, vat = 0, vatRate = 0;
					_.forEach(timesheets, function(timesheet){
						console.log(timesheet);
						var elements = [];
						_.forEach(timesheet.elements, function(_element){
							var element = {
								text: _element.elementType + ' ' + _element.description,
		                        weekEndingDate: timesheet.weekEndingDate,
		                        units: _element.units,
		                        rate: _element.chargeRate,
		                        total: (_element.amount+_element.vat).toFixed(2)
							};
							net += _element.units * _element.chargeRate;
							elements.push(element);
						});

						var line = {
							worker: timesheet.worker,
							lineType: 'timesheet',
							elements: elements
						};
						lines.push(line);

						//Update Timesheet
						utils.updateSubModel(timesheet.payrollSettings, invoice.companyDefaults);
						timesheetservice.saveTimesheet(timesheet._id, timesheet);
					});
					
					// For Vat
					var invoiceInfo, invoiceModel;
					var vatCharged = invoice.companyDefaults.vatCharged;
					if(vatCharged){
						// Find VAT
						return systemservice.getVat().then(function(amount){
							console.log('With Vat');
							invoiceInfo = {
								agency: invoice.agency,
								branch: invoice.branch,
								timesheetBatch: invoice.timesheetBatch,
								date: invoice.date,
								dueDate: invoice.dueDate,
								lines: lines,
								companyDefaults: invoice.companyDefaults,
								net: net,
						        vatRate: amount,
						        vat: net * amount,
						        total: (net+vat).toFixed(2)
							};
							
							invoiceModel = new db.Invoice(invoiceInfo);
							return Q.nfcall(invoiceModel.save.bind(invoiceModel))
							.then(function(){
								resolve(invoiceModel);
							},reject);
						}, reject);
					}else{
						invoiceInfo = {
							agency: invoice.agency,
							branch: invoice.branch,
							timesheetBatch: invoice.timesheetBatch,
							date: invoice.date,
							dueDate: invoice.dueDate,
							lines: lines,
							companyDefaults: invoice.companyDefaults,
							net: net,
					        vatRate: vatRate,
					        vat: vat,
					        total: (net+vat).toFixed(2)
						};
						
						invoiceModel = new db.Invoice(invoiceInfo);
						return Q.nfcall(invoiceModel.save.bind(invoiceModel))
						.then(function(){
							resolve(invoiceModel);
						},reject);
					}

					
				}, reject);
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