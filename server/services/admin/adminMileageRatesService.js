'use strict';

module.exports=function(dbs){

var Q=require('q');
var systemservice = require('../../services/systemservice')(dbs);
var service = {};

service.saveMileageRates = function(mileageRatesInfo){
	return Q.Promise(function(resolve,reject){
		return systemservice.getSystem()
			.then(function(systemModel){
				if(systemModel){
					console.log('edit');
					console.log(mileageRatesInfo);
					systemModel.mileageRates = [];
					console.log(systemModel);
					
					systemModel.mileageRates = mileageRatesInfo;
					// systemModel.markModified('mileageRates');
					return Q.all([Q.nfcall(systemModel.save.bind(systemModel))])
					.then(function(){
							resolve(systemModel);
						},reject);				
				}
			}, reject);
	});
};

return service;
};