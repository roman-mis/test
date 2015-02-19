'use strict';
var Q=require('q');

module.exports=function(dbs){
	var db = dbs,
		
		utils=require('../utils/utils'),
		_ = require('lodash');

	var service={};

	function createSystemModel(systemDetails){
		var _systemModel = new db.System(systemDetails);
		return Q.Promise(function(resolve,reject){
			return Q.nfcall(_systemModel.save.bind(_systemModel))
				.then(function(){
						resolve(_systemModel);
					},reject);
		});
	}


	service.saveSystem = function(systemDetails){
		return Q.Promise(function(resolve,reject){
			return service.getSystem()
				.then(function(systemModel){
					if(systemModel){
						// Edit
						console.log('edit');
						utils.updateModel(systemModel, systemDetails);
						return Q.nfcall(systemModel.save.bind(systemModel))
						.then(function(){
								resolve(systemModel);
							},reject);
					}else{
						// Add
						console.log('add');
						
						return createSystemModel(systemDetails)
							.then(function(_systemModel){
									resolve(_systemModel);
								},reject);
					}
					
				}, reject);
		});
	};


	service.savePaymentRates = function(id, paymentInfo){
		return Q.Promise(function(resolve,reject){
			return service.getSystem()
				.then(function(systemModel){
					if(systemModel){
						if(id){
							console.log('edit');
							
							utils.updateSubModel(systemModel.paymentRates.id(id), paymentInfo);
							return Q.nfcall(systemModel.save.bind(systemModel))
							.then(function(){
									resolve(systemModel.paymentRates.id(id));
								},reject);
						}else{
							console.log('add');console.log(paymentInfo);
							systemModel.paymentRates.push(paymentInfo);
							return Q.nfcall(systemModel.save.bind(systemModel))
							.then(function(){
									resolve(systemModel.paymentRates[systemModel.paymentRates.length-1]);
								},reject);
						}
					}
				}, reject);
		});
	};

	service.saveVat = function(id, vatInfo){
		return Q.Promise(function(resolve,reject){
			return service.getSystem()
				.then(function(systemModel){
					if(systemModel){
						if(id){
							console.log('edit');
							
							utils.updateSubModel(systemModel.statutoryTables.vat.id(id), vatInfo);
							return Q.nfcall(systemModel.save.bind(systemModel))
							.then(function(){
									resolve(systemModel.statutoryTables.vat.id(id));
								},reject);
						}else{
							console.log('add');
							systemModel.statutoryTables.vat.push(vatInfo);
							return Q.nfcall(systemModel.save.bind(systemModel))
							.then(function(){
									resolve(systemModel.statutoryTables.vat[systemModel.statutoryTables.vat.length-1]);
								},reject);
						}
					}
				}, reject);
		});
	};

	service.getSystem=function(){
		var q=db.System.findOne();
		return Q.Promise(function(resolve,reject){
			return Q.nfcall(q.exec.bind(q))
				.then(function(system){
					if(system){
						resolve(system);
					}
					else{
						return createSystemModel({})
							.then(function(_system){
								resolve(_system);
							});
					}
				},reject);

		});
	};

	service.getVat = function(){
		return Q.Promise(function(resolve){
			return service.getSystem()
			.then(function(system){
				if(system.statutoryTables.vat){
					var currentDate = new Date();console.log(currentDate);
					_.forEach(system.statutoryTables.vat, function(_vat){
						console.log(_vat);
						if(currentDate >= _vat.validFrom && currentDate <= _vat.validTo){
							resolve(_vat.amount);
							return false;
						}
					});
					resolve(0);
				}else{
					resolve(0);
				}
			}, resolve(0));
		});
	};
    
    service.getStatutoryValue = function(name){
		return Q.Promise(function(resolve,reject){
			return service.getSystem()
			.then(function(system){
				if(system.statutoryTables[name]){
					var currentDate = new Date();console.log(currentDate);
					_.forEach(system.statutoryTables[name], function(_value){
						console.log(_value);
						if(currentDate >= _value.validFrom && currentDate <= _value.validTo){
							resolve(_value);
							return false;
						}
					});
					resolve({});
				}else{
					resolve({});
				}
			}, reject);
		});
	};

	service.addExpensesRate=function(expenseRateDetails){
		return Q.Promise(function(resolve){
			return service.getSystem()
				.then(function(system){

					var expenseRateModel=system.expensesRate.create(expenseRateDetails);
					system.expensesRate.push(expenseRateModel);
					return saveSystemModel(system)
						.then(function(){
							resolve({result:true,object:{system:system,expensesRate:expenseRateModel}});
						});
				});
		});
	};

	service.updateExpensesRate=function(id,expenseRateDetails){
		return Q.Promise(function(resolve){
			return service.getSystem()
				.then(function(system){

					var expenseRateModel=system.expensesRate.id(id);
					utils.updateSubModel(expenseRateModel,expenseRateDetails);
					return saveSystemModel(system)
						.then(function(){
							resolve({result:true,object:{system:system,expensesRate:expenseRateModel}});
						});
				});
		});
	};

	return service;
};

function saveSystemModel(systemModel){
	return Q.nfcall(systemModel.save.bind(systemModel));
}