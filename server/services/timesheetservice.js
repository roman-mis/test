'use strict';

module.exports=function(db){
	var Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
		_=require('lodash');
	var utils=require('../utils/utils');
	var systemservice=require('./systemservice')(db),
	candidatecommonservice=require('./candidatecommonservice')(db);
	
	var service={};

	service.getTimesheets = function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.Timesheet.find().populate('worker').populate('batch');

			queryutils.applySearch(q, db.Timesheet, request)
				.then(resolve,reject);
		});
	};

	service.getTimesheetsByBatchId = function(id){
		var q=db.Timesheet.find({'batch':id});
		return Q.nfcall(q.exec.bind(q));
	};

	service.getTimesheet = function(id, populate){
		var q=db.Timesheet.findById(id);
		if(populate){
			q.populate('worker');
			q.populate('batch');
		}

		return Q.nfcall(q.exec.bind(q));
	};

	service.getCSVFile = function(code, file){
		switch(code){
			case '1':
				return getStandardTemplate(file);
			case '2':
				break;
		}
	};

	function findPaymentRate(paymentRates, search){
		var paymentRate = {};
		_.forEach(paymentRates, function(_paymentRate){
			if(_paymentRate.name.toString().trim().toLowerCase() === search.trim().toLowerCase() || (_paymentRate.importAliases.indexOf(search) > 0)){
				paymentRate = _paymentRate;
				return false;
			}
		});
		return paymentRate;
	}

	function getStandardTemplate(file){
		return Q.Promise(function(resolve,reject){
			return utils.readCsvFromFile(file.path).then(function(data){
				return systemservice.getSystem()
			  	.then(function(system){
			  		var paymentRates = system.paymentRates;
			  			console.log('Format 1');
				  		var finishData = [];
				  		_.forEach(data, function(row){
			  				candidatecommonservice.getUserByRef(row.contractorReferenceNumber)
			  				.then(function(candidate){
			  					row.validationErrors = [];
					  			if(row.rateDescription){
					  				var paymentRate = findPaymentRate(paymentRates, row.rateDescription);
					  				row.elementType = paymentRate._id || null;
					  				row.paymentRate = paymentRate;
					  				// Add No Matching Payrment Rate validation if not matching
					  				if(!row.elementType){
		  								row.validationErrors.push('No Matching Payment Rate Found.');
					  				}
					  			}
					  			
					  			// Add No Matching Candidate validation if not matching
					  			if(!candidate){
					  				row.validationErrors.push('No Matching Contractor Found.');
					  			}else{
					  				if(candidate.firstName !== row.contractorForename){
					  					row.validationErrors.push('Contractor First Name Mismatch.');
					  				}
					  				if(candidate.lastName !== row.contractorSurname){
					  					row.validationErrors.push('Contractor Last Name Mismatch.');
					  				}
					  			}
					  			var contractor = candidate || {};
					  			row.contractor = {_id: contractor._id, firstName: contractor.firstName, lastName: contractor.lastName};
					  			row.worker = contractor._id;
					  			row.total = row['total(gross)'];
					  			row.net = row['total(net)'];
					  			row.units = row.noOfUnits;
					  			row.payRate = row.unitRate;
					  			row.holidayPayIncluded = row.holidayPayRule;
					  			row.holidayPayDays = row.holidayPayRate;
		                		finishData.push(row);
			  				}).then(function(){
			  					if(Object.keys(data).length === Object.keys(finishData).length){
			  						resolve(finishData);
			  					}
			  				});
						});
			  	}, reject);
			}, function(err){
				resolve({result:false, error: err});
			});
		});
	}

	service.saveBulkTimesheet = function(timesheetData){
		return Q.Promise(function(resolve,reject){
			
			// Create Timesheet Batch
			var timesheetBatchDetail = {
				agency: timesheetData[0].agency,
    			branch: timesheetData[0].branch
			};
			var timesheetBatchModel = new db.TimesheetBatch(timesheetBatchDetail);
			
			var timesheetsToSave = [];
			var timesheetsToSavePromise = [];
			// Loop through timesheetData
			_.forEach(timesheetData, function(timesheetDetail){
				timesheetDetail.batch = timesheetBatchModel._id;
				var timesheetModel = new db.Timesheet(timesheetDetail);
				timesheetsToSave.push(timesheetModel);
				timesheetsToSavePromise.push(Q.nfcall(timesheetModel.save.bind(timesheetModel)));
			});

			return Q.nfcall(timesheetBatchModel.save.bind(timesheetBatchModel)).then(function(){
				return Q.all(timesheetsToSavePromise).then(function(){
					console.log(timesheetsToSave);
					resolve(timesheetsToSave);
				}, reject);
			});
		});
	};

	service.saveTimesheet = function(id, timesheetDetails){
		return Q.Promise(function(resolve,reject){
			return systemservice.getSystem()
			.then(function(system){
				var paymentRates = system.paymentRates;
				if(id === null){
					var timesheetBatchDetail = {
						agency: timesheetDetails.agency,
	        			branch: timesheetDetails.branch
					};
					var timesheetBatchModel = new db.TimesheetBatch(timesheetBatchDetail);

					var elements = [];
					_.forEach(timesheetDetails.elements, function(_element){
						var paymentRate = {};
						var _paymentRate = paymentRates.id(_element.elementType);
						if(_paymentRate){
							paymentRate = {
			                    name: _paymentRate.name,
			                    rateType: _paymentRate.rateType,
			                    hours: _paymentRate.hours,
			                };
						}
						
						var element = {
			                elementType: _element.elementType,
			                description: _element.description,
			                units: _element.units,
			                payRate: _element.payRate,
			                chargeRate: _element.chargeRate,
			                amount: _element.amount,
			                vat: _element.vat,
			                isCis: _element.isCis,
			                paymentRate: paymentRate
			            };
			            elements.push(element);
					});

					var timesheetDetail = {
						worker: timesheetDetails.worker,
				        batch: timesheetBatchModel._id,
				        agency: timesheetDetails.agency,
				        status: timesheetDetails.status,
				        payFrequency: timesheetDetails.payFrequency,
				        weekEndingDate: timesheetDetails.weekEndingDate,
				        elements: elements,
				        net: timesheetDetails.net,
				        vat: timesheetDetails.vat,
				        totalPreDeductions: timesheetDetails.totalPreDeductions,
				        deductions: timesheetDetails.deductions,
				        total: timesheetDetails.total,
				        imageUrl: timesheetDetails.imageUrl
					};
					var timesheetModel = new db.Timesheet(timesheetDetail);
					return Q.all([Q.nfcall(timesheetModel.save.bind(timesheetModel)), Q.nfcall(timesheetBatchModel.save.bind(timesheetBatchModel))])
						.then(function(){
							resolve(timesheetModel);
						},reject);
				}else{
					return service.getTimesheet(id)
						.then(function(timesheet){
							if(timesheet){
								utils.updateSubModel(timesheet, timesheetDetails);
								return Q.nfcall(timesheet.save.bind(timesheet))
									.then(function(){
										resolve(timesheet);
									},reject);
							}else{
								reject({result:false,name:'NOTFOUND',message:'Timesheet not found'});
							}
						}, reject);
				}
			}, reject);
		});
	};

	return service;
};