'use strict';

module.exports=function(db){
	var Q=require('q'),
		queryutils=require('../utils/queryutils')(db);

	var service={};

	service.getAllTimesheetBatches = function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.TimesheetBatch.find();
			queryutils.applySearch(q,db.TimesheetBatch,request)
			.then(resolve,reject);
		});
	};

	
    
	return service;
};