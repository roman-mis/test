'use strict';

var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
var _=require('lodash');
var service={};
var utils=require('../utils/utils');
var candidatecommonservice=require(__dirname+'/candidatecommonservice');

//service.getWorkerByUser = candidatecommonservice.getWorkerByUser;

service.getPayrollProductDetails = function(id){
	var query=db.User.findById(id)
		.populate('worker.payrollProduct.agency');

	return Q.Promise(function(resolve,reject){
	    Q.nfcall(query.exec.bind(query))
	    .then(function(user){
		     var payrollProducts = [];
        	_.forEach(user.worker.payrollProduct, function(value, key){
	          	if(value === null){
	          		return;
	          	}
	          	var agency = value.agency;
	          	var branch = null, consultant = null;
	          	if(agency.branches !== undefined){
		            // Get Branch
		            if(user.worker.payrollProduct[key].branch !== undefined){
		            	var currentBranch = value.agency.branches.id(user.worker.payrollProduct[key].branch);
			            branch = {
			              '_id' : currentBranch.id,
			              'name' : currentBranch.name
			            };
		            }

		            // Get Consultant
		            if(user.worker.payrollProduct[key].consultant !== undefined){
		            	_.forEach(agency.branches, function(branch){
			            	if(branch.consultants.length > 0){
			            		var currentConsultant = branch.consultants.id(user.worker.payrollProduct[key].consultant);
			            		if(currentConsultant !== null){
				            		consultant = {
						                '_id' : currentConsultant.id,
						                'name' : currentConsultant.name
					              	};
					              	return false;
			            		}
			            	}
			            });
		            }
		        }
	          	
	          	var payrollProduct = {
		            agency: {
		              '_id' : agency.id,
		              'name' : agency.name
		            },
		            branch: branch,
		            consultant: consultant,
		            agencyRef: value.agencyRef,
		            margin: value.margin,
		            marginFixed: value.marginFixed,
		            holidayPayRule: value.holidayPayRule,
		            derogationContract: value.derogationContract,
		            derogationSpread: value.derogationSpread,
		            serviceUsed: value.serviceUsed,
		            paymentTerms: value.paymentTerms,
		            paymentMethod: value.paymentMethod,
		            jobDescription: value.jobDescription,
		            createdDate: value.createdDate,
		            _id: value.id,
		            marginException: value.marginException
	         	};
	          	payrollProducts.push(payrollProduct);
	        });
			resolve(payrollProducts);
	    },reject);
	});
};

service.updatePayrollTaxDetails=function(userId, payrollTaxDetails){
	var deff=Q.defer();
	candidatecommonservice.getUser(userId)
	   .then(function(user){
	   		if(user){
   				// var worker = user.worker;
   				utils.updateSubModel(user.worker.taxDetail,{niNumber:payrollTaxDetails.niNumber});
   				utils.updateSubModel(user.worker,{startDate:payrollTaxDetails.startDate});
   				// worker.taxDetail.niNumber = payrollTaxDetails.niNumber;
   				// worker.startDate = payrollTaxDetails.startDate;
   				// var props = utils.updateSubModel(user.worker.payrollTax, payrollTaxDetails);
   				console.log(user);
				return Q.nfcall(user.save.bind(user)).then(function(){
					deff.resolve(user);						
				}, deff.reject);
	   		} else {
	   			deff.reject({name:'NotFound', message:'No Payroll Tax detail found'});
	   		}
	}, deff.reject);
   	return deff.promise;
};

service.updatePayrollProductDetails=function(userId, payrollProductDetails){
	var deff=Q.defer();

	candidatecommonservice.getUser(userId)
	   .then(function(user){
	   		if(user){
	   			var product;
   				if(payrollProductDetails._id === ''|| payrollProductDetails._id === undefined){
   					console.log('add');
   					delete payrollProductDetails._id;
   					payrollProductDetails.createdDate = new Date();
   					user.worker.payrollProduct.push(payrollProductDetails);
   					console.log(payrollProductDetails);
   					product=user.worker.payrollProduct[user.worker.payrollProduct.length-1];

   				}else{
   					console.log('edit');
   					
   					product=user.worker.payrollProduct.id(payrollProductDetails._id);
   					if(product){
   						payrollProductDetails.updatedDate = new Date();
   						utils.updateSubModel(user.worker.payrollProduct.id(payrollProductDetails._id),payrollProductDetails);
   					}
   					else{
   						return deff.reject({result:false,name:'NotFound',message:'Product not found'});
   					}
   				}

   				return Q.nfcall(user.save.bind(user)).then(function(){
					deff.resolve({user:user, product:product});						
				}, deff.reject);
	   		} else {
	   			deff.reject({name:'NotFound',message:'No Payroll Product detail found'});
	   		}
	}, deff.reject);
   	return deff.promise;
};

service.deletePayrollProductDetails=function(candidateId, productId){
	var deff=Q.defer();
	candidatecommonservice.getUser(candidateId)
		.then(function(user){
			if(user){
				var products = user.worker.payrollProduct;
				var product = user.worker.payrollProduct.id(productId);
				
				// Get Index
				var index = products.indexOf(product);
				user.worker.payrollProduct.splice(index, 1);

				return Q.nfcall(user.save.bind(user)).then(function(){
					deff.resolve();						
				}, deff.reject);
			} else {
	   			deff.reject({name:'NotFound',message:'No Candidate found'});
	   		}
		}, deff.reject);
   	return deff.promise;
};

service.postMarginException = function(candidateId, productId, marginExceptionDetails){
	var deff=Q.defer();
	candidatecommonservice.getUser(candidateId)
		.then(function(user){
			if(user){
				user.worker.payrollProduct.id(productId).marginException.push(marginExceptionDetails);
				return Q.nfcall(user.save.bind(user)).then(function(){
					var marginException = user.worker.payrollProduct.id(productId).marginException;
					deff.resolve({object:marginException[marginException.length-1]});						
				}, deff.reject);
			} else {
	   			deff.reject({name:'NotFound',message:'No Candidate found'});
	   		}
		}, deff.reject);
   	return deff.promise;
};

service.patchMarginException = function(candidateId, productId, marginExceptionId, marginExceptionDetails){
	var deff=Q.defer();
	candidatecommonservice.getUser(candidateId)
		.then(function(user){
			if(user){
				console.log(marginExceptionId);
				utils.updateSubModel(user.worker.payrollProduct.id(productId).marginException.id(marginExceptionId), marginExceptionDetails);
				return Q.nfcall(user.save.bind(user)).then(function(){
					var marginException = user.worker.payrollProduct.id(productId).marginException.id(marginExceptionId);
					console.log(marginException);
					deff.resolve({object:marginException});						
				}, deff.reject);
			} else {
	   			deff.reject({name:'NotFound',message:'No Candidate found'});
	   		}
		}, deff.reject);
   	return deff.promise;
};

service.deleteMarginException = function(candidateId, productId, marginExceptionId){
	var deff=Q.defer();
	candidatecommonservice.getUser(candidateId)
		.then(function(user){
			if(user){
				var marginException = user.worker.payrollProduct.id(productId).marginException.id(marginExceptionId);
				var index = user.worker.payrollProduct.id(productId).marginException.indexOf(marginException);
				user.worker.payrollProduct.id(productId).marginException.splice(index, 1);
				return Q.nfcall(user.save.bind(user)).then(function(){
					deff.resolve();						
				}, deff.reject);
			} else {
	   			deff.reject({name:'NotFound',message:'No Candidate found'});
	   		}
		}, deff.reject);
   	return deff.promise;
};

module.exports=service;