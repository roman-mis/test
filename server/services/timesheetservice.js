'use strict';

module.exports=function(){
	var db = require('../models'); 
	var Q=require('q'),
		queryutils=require('../utils/queryutils')(db);
	var utils=require('../utils/utils');
	
	var service={};

	service.getTimesheets = function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.Timesheet.find().populate('worker').populate('batch');

			queryutils.applySearch(q, db.Timesheet, request)
				.then(resolve,reject);
		});
	};

	service.getTimesheetsByBatchId = function(id){
		console.log(id);
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

	service.saveTimesheet = function(id, timesheetDetails){
		return Q.Promise(function(resolve,reject){
			if(id === null){
				var timesheetBatchDetail = {
					agency: timesheetDetails.agency,
        			branch: timesheetDetails.branch
				};
				var timesheetBatchModel = new db.TimesheetBatch(timesheetBatchDetail);

				var timesheetDetail = {
					worker: timesheetDetails.worker,
			        batch: timesheetBatchModel._id,
			        status: timesheetDetails.status,
			        weekEndingDate: timesheetDetails.weekEndingDate,
			        elements: timesheetDetails.elements,
			        net: timesheetDetails.net,
			        vat: timesheetDetails.vat,
			        totalPreDeductions: timesheetDetails.totalPreDeductions,
			        deductions: timesheetDetails.deductions,
			        total: timesheetDetails.total,
			        imageUrl: timesheetDetails.imageUrl
				};
				var timesheetModel = new db.Timesheet(timesheetDetail);console.log(timesheetModel);
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
								.then(function(timesheet){
									resolve(timesheet);
								},reject);
						}else{
							reject({result:false,name:'NOTFOUND',message:'Timesheet not found'});
						}
					}, reject);
			}
		});
	};

	return service;
};