'use strict';

module.exports=function(dbs){
	var db = dbs,
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db);
		// TimesheetService = require('Timesheetservice');
	var service={};

	service.getAllTimesheetBatches = function(request){
		console.log('5555555555555555555555555555555555555555555')
		return Q.Promise(function(resolve,reject){
			var q=db.TimesheetBatch.find();
			queryutils.applySearch(q,db.TimesheetBatch,request)
			.then(resolve,reject);
		});
	};

	service.getTimesheetBatchesWithTimesheet = function(){
		return Q.Promise(function(resolve,reject){
			var q1=db.TimesheetBatch.find().populate('agency','name').populate('branch');
			var q2=db.Timesheet.find().populate('worker','firstName lastName emailAddress title');
		  var newTimesheetBatches = [];
			Q.nfcall(q1.exec.bind(q1)).then(function(timesheetbatches){

				Q.nfcall(q2.exec.bind(q2)).then(function(timesheets){
					
					timesheetbatches.forEach(function(timesheetbatch){
						
						var newTimesheetbatch  				= {};
						newTimesheetbatch.id 					= timesheetbatch._id;
						newTimesheetbatch.branch 			= timesheetbatch.branch;
						newTimesheetbatch.agency			= timesheetbatch.agency;
						newTimesheetbatch.batchNumber	= timesheetbatch.batchNumber;
						newTimesheetbatch.timesheets 	= [];

						timesheets.forEach(function(timesheet){
							
							if(timesheet.batch+'' === timesheetbatch._id+''){
								newTimesheetbatch.timesheets.push(timesheet);
							}

						});
						newTimesheetBatches.push(newTimesheetbatch);
					});
					resolve(newTimesheetBatches);

				},function(){
					reject();
				});
			},function(err){
				reject(err);
			});
		});
	};

	  
	return service;
};