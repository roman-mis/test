'use strict';

module.exports=function(dbs){

var Q=require('q');
var systemservice = require('../../services/systemservice')(dbs);
var service = {};
var utils = require('../../utils/utils.js');

service.saveExpenseRates = function(id, expensesRateInfo){
	return Q.Promise(function(resolve,reject){
		return systemservice.getSystem()
			.then(function(systemModel){
				if(systemModel){
					if(!systemModel.expensesRate){
						systemModel.expensesRate = [];
					}
					console.log(utils.updateSubModel(systemModel.expensesRate.id(id)));
					var _expensesRate;
					if(id){
						utils.updateSubModel(systemModel.expensesRate.id(id), expensesRateInfo);
						_expensesRate = systemModel.expensesRate.id(id);
					}else{
						systemModel.expensesRate.push(expensesRateInfo); 
						_expensesRate = systemModel.expensesRate[systemModel.expensesRate.length-1];
					}

					return Q.all([Q.nfcall(systemModel.save.bind(systemModel))])
						.then(function(){
							resolve(_expensesRate);
						},reject);
				}
			}, reject);
	});
};

return service;
};