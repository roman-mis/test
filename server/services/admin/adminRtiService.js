'use strict';

module.exports=function(dbs){

var Q=require('q');
var utils=require('../../utils/utils');
var systemservice = require('../../services/systemservice')(dbs);
var service = {};
var xml2js=require('xml2js');

service.saveRti = function(mileageRatesInfo){
	return Q.Promise(function(resolve,reject){
		return systemservice.getSystem()
			.then(function(systemModel){
				if(systemModel){
					console.log('edit');
					
					utils.updateSubModel(systemModel.rti, mileageRatesInfo);
					return Q.nfcall(systemModel.save.bind(systemModel))
					.then(function(){
							resolve(systemModel);
						},reject);				}
			}, reject);
	});
};

service.submitRti=function(){

};

function buildXml(rti){
	return Q.Promise(function(resolve,reject){
		var doc= new xml2js.Document();
		var rootNode=doc.node('GovTalkMessage').attr({xmlns:'xmlns="http://www.govtalk.gov.uk/CM/envelope"'});
			rootNode.node('EnvelopeVersion','2.0');
		var headerNode=rootNode.node('Header');
		var messageDetailNode=headerNode.node('MessageDetails');
		

		resolve(doc);
	});
}

return service;
};