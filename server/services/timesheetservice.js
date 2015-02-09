'use strict';

module.exports=function(){
	var db = require('../models'); 
	var Q=require('q');
	var utils=require('../utils/utils');
	
	var service={};

	service.getTimesheets = function(){
		var q=db.Timesheet.find();
		return Q.nfcall(q.exec.bind(q));
	};

	service.getTimesheet = function(id){
		var q=db.Timesheet.findById(id);
		return Q.nfcall(q.exec.bind(q));
	};

	service.saveTimesheet = function(id, timesheetDetails){
		return Q.Promise(function(resolve,reject){
			if(id === null){
				var timesheetModel = new db.Timesheet(timesheetDetails);
				return Q.nfcall(timesheetModel.save.bind(timesheetModel))
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