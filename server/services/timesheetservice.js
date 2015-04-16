'use strict';

module.exports=function(db){
	var Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
		_=require('lodash'),
		utils=require('../utils/utils'),
		systemservice=require('./systemservice')(db),
		awsservice=require('./awsservice'),
		processor=require('./timesheetprocessor')(db);
	
	var service={};

	service.getTimesheets = function(request){
		console.log('#####################@@@@@@@@@@@@@@@@@@')
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

	service.getTimesheetsByCandidateId = function(id){
		var q=db.Timesheet.find({'worker':id});
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
		return Q.Promise(function(resolve,reject){
			return processor.getCSVFile(code, file)
			.then(function(finishData){
				if(finishData.validationFailError){
					resolve({data: finishData});
				}else{
					var s3ObjectName = new Date().getTime().toString() + '_' + file.name;
					var folder=process.env.S3_TEMP_FOLDER;
					var s3ObjectType = file.mimetype || 'text/plain';
					var body = require('fs').readFileSync(file.path);

					return awsservice.putS3Object(body,s3ObjectName,s3ObjectType,folder)
					.then(function(){
						resolve({url: s3ObjectName, data: finishData});
					},reject);
				}
				
			}, reject);
		});
	};

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

	service.getTimesheetsWithAgency = function(){
		return Q.Promise(function(resolve,reject){
			var q=db.Timesheet.find().populate('agency', '_id name');
			console.log('^^^^^^^^^^^^^')
			return Q.nfcall(q.exec.bind(q)).then(function(res){
				resolve(res);
			},function(err){
				reject(err);
			});
		});
	};

	service.changeStatus = function(id){
		return Q.Promise(function(resolve,reject){
			service.getTimesheet(id).then(function(res){
				resolve(res);
			},function(err){
				reject(err);
			});
		});
	};

	service.updateTimesheets = function(req){
		console.log('&&&&&&&&&/&&&&&&&&&&&&');
		return Q.Promise(function(resolve,reject){
			var	index = -1;
			if(req.length === 0){
				resolve();
			}
			req.forEach(function(reqElement){
				index++;
				service.getTimesheet(reqElement._id).then(function(res){
					res.net = 1000;
					for(var key in reqElement){
						console.log(key);
						if(key === 'elements'){
							for(var j = 0; j < res.elements.length; j++){
								for(var k = 0; k < reqElement.elements.length; k++){
									if(res.elements[j]._id + '' === reqElement.elements[k]._id + ''){
										for(var key3 in reqElement.elements[k]){
											res.elements[j][key3] = reqElement.elements[k][key3];
										}
									}
								}
							}
						}else{
							res[key] = reqElement[key];
						}
					}

					Q.nfcall(res.save.bind(res)).then(function(){
						if(index+1 === req.length){
							resolve();
						}

					},function(err){
						reject(err);	
					});
				},function(err){
					reject(err);
				});
			});
		});
	};
	return service;
};
