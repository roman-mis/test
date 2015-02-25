'use strict';

module.exports=function(dbs){

var Q=require('q');
var utils=require('../../utils/utils');
var systemservice = require('../../services/systemservice')(dbs);
var service = {};

service.saveMileageRates = function(mileageRatesInfo){
	return Q.Promise(function(resolve,reject){
		return systemservice.getSystem()
			.then(function(systemModel){
				if(systemModel){
					console.log('edit');
					
					utils.updateSubModel(systemModel.mileageRates, mileageRatesInfo);
					return Q.nfcall(systemModel.save.bind(systemModel))
					.then(function(){
							resolve(systemModel);
						},reject);				}
			}, reject);
	});
};

return service;
};