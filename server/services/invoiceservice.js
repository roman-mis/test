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
			agencyservice.getAgency(invoice.agency).then(function(agency){
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
									invoiceModel.save.bind(invoiceModel);
									console.log(invoiceInfo);
									console.log('here');
								});
								console.log('end');
								resolve({result:true});
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
										resolve(invoiceModel);
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
									resolve(invoiceModel);
								},reject);
							}
						}, reject);
					}
				}else{
					reject.json({result:false,message:'Agency Invoice Method not set'});
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