	'use strict';

module.exports=function(){
	var db = require('../models'),
		Q=require('q'),
		_=require('lodash'),
		queryutils=require('../utils/queryutils')(db),
		utils=require('../utils/utils'),
		timesheetservice=require(__dirname+'/timesheetservice')(),
		systemservice=require('./systemservice')(db),
		agencyservice=require('./agencyservice');

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
			return agencyservice.getAgency(invoice.agency).then(function(agency){
				if(agency){
					if(agency.defaultInvoicing.invoiceMethod){
						// Invoice Method (1: Consolidated, 2: Individual)
						if(agency.defaultInvoicing.invoiceMethod.toString() === '2'){
							console.log('Individual');
							// var invoices = [];
							return timesheetservice.getTimesheetsByBatchId(invoice.timesheetBatch)
							.then(function(timesheets){
								// Check VAT
								var vatCharged = invoice.companyDefaults.vatCharged;
								return systemservice.getVat(vatCharged).then(function(amount){
									var lines = [];
									var net = 0, vat = 0;
									var timesheetsToUpdate=[];
									var invoicesToSave=[];

									_.forEach(timesheets, function(timesheet){
										var elements = [];
										_.forEach(timesheet.elements, function(_element){
											var element = {
												text: _element.paymentRate.name,
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
										//timesheetservice.saveTimesheet(timesheet._id, timesheet);
										timesheetsToUpdate.push(timesheet);

										// For Vat
										var invoiceInfo, invoiceModel;
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
										// invoiceModel.save.bind(invoiceModel);
										invoicesToSave.push(invoiceModel);
										// console.log(invoiceInfo);
										// console.log('here');
									});
									console.log('stacking invoice promises');
									var allInvoiceSavePromises = [];
									var prom = new Q(true);
									_.forEach(invoicesToSave,function(invoiceModel){
										prom=prom.then(function(){
											console.log('saving invoice '+invoiceModel._id);
											// return Q.nfcall(invoiceModel.save.bind(invoiceModel));
											allInvoiceSavePromises.push(Q.nfcall(invoiceModel.save.bind(invoiceModel)));
										});
									});
									Q.all([allInvoiceSavePromises]);
									
									console.log('stacking timesheet');
									_.forEach(timesheetsToUpdate,function(timesheet){
										prom=prom.then(function(){
											console.log('updating timesheet '+timesheet._id);
											return timesheetservice.saveTimesheet(timesheet._id,timesheet);
										});
									});

									console.log('stacking promise fialure');
									prom.fail(function(){
										//revert all invoicesToSave
										_.forEach(invoicesToSave,function(invoiceModel){
											console.log('removing invoiceModel   '+invoiceModel._id);
											return Q.nfcall(invoiceModel.remove.bind(invoiceModel));
											
										});
									});

									return prom.then(function(){
										resolve(invoicesToSave);
									})
									.fail(reject);

									// console.log('end');
									// resolve({result:true});
								});
							});
						}else{
							// Invoice Method: Consolidated
							console.log('Consolidated');
							return timesheetservice.getTimesheetsByBatchId(invoice.timesheetBatch)
							.then(function(timesheets){
								var lines = [];
								var net = 0, vat = 0, vatRate = 0;
								_.forEach(timesheets, function(timesheet){
									var elements = [];
									_.forEach(timesheet.elements, function(_element){
										var element = {
											text: _element.paymentRate.name,
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
											var invoiceModels = [];
											invoiceModels.push(invoiceModel); console.log(invoiceModels);
											resolve(invoiceModels);
										},reject);
									}, reject);
								}else{
									console.log('Without Vat');
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
										var invoiceModels = [];
										invoiceModels.push(invoiceModel); console.log(invoiceModels);
										resolve(invoiceModels);
									},reject);
								}
							}, reject);
						}
					}else{
						reject.json({result:false,message:'Agency Invoice Method not set'});
					}
				}else{
					reject.json({result:false,message:'Agency not found.'});
				}
			});
			
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