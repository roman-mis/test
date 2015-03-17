'use strict';

module.exports=function(dbs){
	var db = dbs,
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db);

	var service={};

	service.getAllTimesheetBatches = function(request){
		console.log('5555555555555555555555555555555555555555555')
		return Q.Promise(function(resolve,reject){
			var q=db.TimesheetBatch.find();
			queryutils.applySearch(q,db.TimesheetBatch,request)
			.then(resolve,reject);
		});
	};

	
    
	return service;
};