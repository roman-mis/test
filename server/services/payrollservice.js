'use strict';

module.exports=function(){
	var db = require('../models'); 
	var Q=require('q');
	var queryutils=require('../utils/queryutils')(db);

	var service={};

	service.getAllPayrolls = function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.Payroll.find();
			queryutils.applySearch(q,db.Payroll,request)
			.then(resolve,reject);
		});
	};

	service.savePayroll = function(invoiceId, payroll){
		var deff = Q.defer();
		var payrollModel;
		payrollModel = new db.Payroll(payroll);
		payrollModel.save(function(err){
			if(err){
				deff.reject(err);
			}else{
				console.log('save success');
				deff.resolve(payrollModel);
			}
		});
		return deff.promise;
	};

	service.getPayroll=function(id){
		var q=db.Payroll.findById(id);
		return Q.nfcall(q.exec.bind(q));
	};

	return service;
};