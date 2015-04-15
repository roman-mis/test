	'use strict';

module.exports=function(){
	var db = require('../models'),
		Q=require('q'),
		_=require('lodash'),
		queryutils=require('../utils/queryutils')(db),
		utils=require('../utils/utils'),
		timesheetservice=require(__dirname+'/timesheetservice')(db),
		systemservice=require('./systemservice')(db),
		agencyservice=require('./agencyservice');

	var service={};

	service.getAllInvoices = function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.Invoice.find().populate('agency').populate('branch').populate('timesheetBatch');
			queryutils.applySearch(q,db.Invoice,request)
			.then(resolve,reject);
		});
	};

	service.saveInvoice = function(invoiceId, invoice){
		return Q.Promise(function(resolve,reject){
			console.log('*********************1');
			agencyservice.getAgency(invoice.agency).then(function(agency){
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
									console.log('*********************2');

									_.forEach(timesheets, function(timesheet){
										var elements = [];
										_.forEach(timesheet.elements, function(_element){
											var element = {
												text: _element.paymentRate.name,
						                        weekEndingDate: timesheet.weekEndingDate,
						                        units: _element.units,
						                        rate: _element.payRate,
						                        total: (_element.amount+_element.vat).toFixed(2)
											};
											net += _element.units * _element.payRate;
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
										console.log('*********************3');

										// For Vat
										var invoiceInfo, invoiceModel;
										invoiceInfo = {
											agency: invoice.agency,
											branch: invoice.branch,
											timesheetBatch: invoice.timesheetBatch,
											date: new Date(),
											dueDate: new Date(),
											lines: lines,
											companyDefaults: invoice.companyDefaults,
											net: net,
									        vatRate: amount,
									        vat: net * amount,
									        total: (net+vat).toFixed(2)
										};
										console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
										console.log('**');
										console.log(invoiceInfo);
										console.log('**');
										invoiceModel = new db.Invoice(invoiceInfo);
										// invoiceModel.save.bind(invoiceModel);
										invoicesToSave.push(invoiceModel);
										// console.log(invoiceInfo);
										// console.log('here');
									});
									console.log('*********************4');

									console.log('stacking invoice promises');
									var allInvoiceSavePromises = [];
									var prom = new Q(true);
									_.forEach(invoicesToSave,function(invoiceModel){
										// prom=prom.then(function(){
										//
										// console.log('saving invoice '+invoiceModel._id);
										// 	return Q.nfcall(invoiceModel.save.bind(invoiceModel));
										// 	// allInvoiceSavePromises.push(Q.nfcall(invoiceModel.save.bind(invoiceModel)));
										// });
										console.log('saving invoice '+invoiceModel._id);
										allInvoiceSavePromises.push(Q.nfcall(invoiceModel.save.bind(invoiceModel)));
									});
									console.log('*********************5');

									// Q.all([allInvoiceSavePromises]);
									prom=prom.then(function(){
										return Q.all([allInvoiceSavePromises]);
									});

									console.log('stacking timesheet');
									_.forEach(timesheetsToUpdate,function(timesheet){
										prom=prom.then(function(){
											console.log('updating timesheet '+timesheet._id);
											return timesheetservice.saveTimesheet(timesheet._id,timesheet);
										});
									});
									console.log('*********************6');

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
						console.log('*********************7');
							// Invoice Method: Consolidated
							console.log('Consolidated');
							var timesheetsToUpdate=[];
							timesheetservice.getTimesheetsByBatchId(invoice.timesheetBatch)
							.then(function(timesheets){
								console.log('here');
								var lines = [];
								var net = 0, vat = 0;
								_.forEach(timesheets, function(timesheet){
									var elements = [];
									_.forEach(timesheet.elements, function(_element){
										var element = {
											text: _element.paymentRate.name,
					                        weekEndingDate: timesheet.weekEndingDate,
					                        units: _element.units,
					                        rate: _element.payRate,
					                        total: (_element.amount+_element.vat).toFixed(2)
										};
										net += _element.units * _element.payRate;
										vat += _element.vat;
										elements.push(element);
									});
									// total = net + vat;
									var line = {
										worker: timesheet.worker,
										lineType: 'timesheet',
										elements: elements
									};
									lines.push(line);

									//Update Timesheet
									utils.updateSubModel(timesheet.payrollSettings, invoice.companyDefaults);
									// timesheetservice.saveTimesheet(timesheet._id, timesheet);
									timesheet.status = 'invoiced';
									timesheetsToUpdate.push(timesheet);
								});

								// For Vat
								var invoiceInfo, invoiceModel;
								var vatCharged = invoice.companyDefaults.vatCharged;
								console.log('********************');
								console.log('###################');
								console.log(invoice.companyDefaults.vatCharged);
								console.log(vatCharged);
								console.log('###################');
								console.log('********************');
								systemservice.getVat(vatCharged).then(function(amount){
									console.log(amount);
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
								        vat: net * amount/100,
								        total: (net+vat).toFixed(2)
									};
									console.log('*****************************************');
									console.log(invoiceInfo);
									console.log('*****************************************');
									invoiceModel = new db.Invoice(invoiceInfo);
										Q.nfcall(invoiceModel.save.bind(invoiceModel))
										.then(function(){

											var promiseArray = [];
											_.forEach(timesheetsToUpdate,function(timesheet){
												console.log('updating timesheet '+timesheet._id);
												promiseArray.push(timesheetservice.saveTimesheet(timesheet._id,timesheet));
												// .then(function(x){
												// 	console.log('$$$$$$$$$1');
												// 	console.log(x);
												// },function(err){
												// 	console.log('$$$$$$$$$1');
												// 	console.log(err);
												// });

											});
											Q.all(promiseArray).then(function(x){
												console.log(x.length);
												console.log(timesheetsToUpdate.length);
												resolve([invoiceModel]);
											},function(err){
												console.log('err',err);
												reject(err);
											});
										},reject);
								}, reject);
							}, reject);
						}
					}else{

						resolve.json({result:false,message:'Agency Invoice Method not set.'});
					}
				}else{

					resolve.json({result:false,message:'Agency not found.'});
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
