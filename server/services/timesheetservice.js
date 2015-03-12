'use strict';

module.exports=function(db){
	var Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
		_=require('lodash'),
		utils=require('../utils/utils'),
		systemservice=require('./systemservice')(db),
		candidatecommonservice=require('./candidatecommonservice')(db),
		awsservice=require('./awsservice');
	
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

			  				// Get Candidate/Worker by Reference Number
			  				return candidatecommonservice.getUserByRef(row.contractorReferenceNumber)
			  				.then(function(candidate){
			  					
			  					// Check for previous timesheet for worker
			  					var worker = (candidate?candidate._id:null);
			  					var weekEndingDate = row.periodEndDate || null;
			  					
			  					return db.Timesheet.findOne({ worker: worker, weekEndingDate: weekEndingDate }).exec()
                  				.then(function(prevTimesheet) {
									
									row.failMessages = [];
				  					row.warningMessages = [];
						  			
						  			if(prevTimesheet){
		  								row.failMessages.push('Duplicate Entry.');
					  				}

						  			if(row.rateDescription){
						  				var paymentRate = findPaymentRate(paymentRates, row.rateDescription);
						  				row.elementType = paymentRate._id || null;
						  				row.paymentRate = paymentRate;
						  				// Add No Matching Payrment Rate validation if not matching
						  				if(!row.elementType){
			  								row.failMessages.push('No Matching Payment Rate Found.');
						  				}
						  			}
						  			
						  			// Add No Matching Candidate validation if not matching
						  			if(!candidate){
						  				row.failMessages.push('No Matching Contractor Found.');
						  			}else{
						  				if(candidate.firstName !== row.contractorForename){
						  					row.failMessages.push('Contractor First Name Mismatch.');
						  				}
						  				if(candidate.lastName !== row.contractorSurname){
						  					row.failMessages.push('Contractor Last Name Mismatch.');
						  				}
						  			}

						  			var contractor = candidate || {};
						  			row.contractor = {_id: contractor._id, firstName: contractor.firstName, lastName: contractor.lastName};
						  			row.worker = contractor._id;
						  			row.total = row['total(gross)'];
						  			if(parseFloat(row.total) <= 0){
						  				row.failMessages.push('Timesheet Value is less than or equal to 0.');
						  			}
						  			row.net = row['total(net)'];
						  			row.units = row.noOfUnits;
						  			row.payRate = row.unitRate;
						  			row.holidayPayIncluded = row.holidayPayRule;
						  			row.holidayPayDays = row.holidayPayRate;
			                		finishData.push(row);
                  				}, reject);
			  				}, reject).then(function(){
			  					if(Object.keys(data).length === Object.keys(finishData).length){
			  						
			  						var s3ObjectName = new Date().getTime().toString() + '_' + file.name;
									var folder=process.env.S3_TEMP_FOLDER;
									var s3ObjectType = file.mimetype || 'text/plain';
									var body = require('fs').readFileSync(file.path);

									return awsservice.putS3Object(body,s3ObjectName,s3ObjectType,folder)
									.then(function(){
										resolve({url: s3ObjectName, data: finishData});
									},reject);
			  					}
			  				});
						});
			  	}, reject);
			}, function(err){
				resolve({result:false, error: err});
			});
		});
	}

	function getTimesheetBatch(timesheetData){
		return Q.Promise(function(resolve,reject){
			if(timesheetData.batchNumber){
				console.log(timesheetData.batchNumber);
				return db.TimesheetBatch.findOne({ batchNumber: timesheetData.batchNumber }).exec()
  				.then(function(timesheetBatch) {
					resolve(timesheetBatch);
  				}, reject);
			}else{
				var timesheetBatchDetail = {
					agency: timesheetData.timesheets[0].agency,
	    			branch: timesheetData.timesheets[0].branch
				};
				var timesheetBatchModel = new db.TimesheetBatch(timesheetBatchDetail);
				resolve(timesheetBatchModel);
			}
		});
	}

	service.saveBulkTimesheet = function(timesheetData){
		return Q.Promise(function(resolve,reject){
			
			return getTimesheetBatch(timesheetData).then(function(timesheetBatchModel){
				console.log(timesheetBatchModel);
				var timesheetsToSave = [];
				var timesheetsToSavePromise = [];
				// Loop through timesheetData
				_.forEach(timesheetData.timesheets, function(timesheetDetail){
					timesheetDetail.batch = timesheetBatchModel._id;
					timesheetDetail.imageUrl = timesheetData.filename;
					timesheetDetail.createdBy = timesheetData.addedBy;
					timesheetDetail.createdDate = new Date();
					timesheetDetail.updatedBy = timesheetData.addedBy;
					timesheetDetail.updatedDate = new Date();

					var timesheetModel = new db.Timesheet(timesheetDetail);
					timesheetsToSave.push(timesheetModel);
					timesheetsToSavePromise.push(Q.nfcall(timesheetModel.save.bind(timesheetModel)));
				});

				// Move file from temp to Timesheet folder
				var fileName = timesheetData.filename;
				return awsservice.moveS3Object(process.env.S3_TEMP_FOLDER+fileName,fileName,process.env.S3_TIMESHEET_FOLDER)
				.then(function(){
					// Save Timesheet Batch
					return Q.nfcall(timesheetBatchModel.save.bind(timesheetBatchModel)).then(function(){
						// Save all timesheets
						return Q.all(timesheetsToSavePromise).then(function(){
							resolve(timesheetsToSave);
						}, reject);
					});
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