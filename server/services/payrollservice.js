// 'use strict';

var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
var _=require('lodash');
var mailer=require('../mailing/mailer');
var uuid = require('node-uuid');
var url=require('url');
var service={};
var utils=require('../utils/utils');
var awsservice=require('../services/awsservice');
var candidatecommonservice=require(__dirname+'/candidatecommonservice');

//service.getWorkerByUser = candidatecommonservice.getWorkerByUser;

service.getPayrollProductDetails = function(id){
	var query=db.User.findById(id)
		.populate('worker.payroll_product.agency_id');
	// Q.nfcall(query.exec.bind(query)).then(function(result){
		
	// 	result['candidate_no'] = 'test'; // Original Value = 1, changing to test
	// 	result.candidate_no = 'test';
	// 	console.log(result['candidate_no']); // Still displays 1

	// 	deff.resolve(result);

	// }, deff.reject);
	// return deff.promise;
	return Q.Promise(function(resolve,reject){
	    Q.nfcall(query.exec.bind(query))
	    .then(function(user){
		     var payroll_products = [];
        
	        _.forEach(user.worker.payroll_product, function(value, key){
	          	var agency = value.agency_id;
	          	var branch = null, consultant = null;
	          	if(agency.branches != undefined){
		            // Get Branch
		            if(user.worker.payroll_product[key].branch_id != undefined){
		            	var current_branch = value.agency_id.branches.id(user.worker.payroll_product[key].branch_id);
			            branch = {
			              "_id" : current_branch.id,
			              "name" : current_branch.name
			            };
		            }
		            console.log('here');

		            // Get Consultant
		            if(user.worker.payroll_product[key].consultant_id != undefined){
		            	_.forEach(agency.branches, function(branch, key){
			            	if(branch.consultants.length > 0){
			            		var current_consultant = branch.consultants.id(user.worker.payroll_product[key].consultant_id);
			            		if(current_consultant != null){
				            		consultant = {
						                "_id" : current_consultant.id,
						                "name" : current_consultant.name
					              	};
					              	return false;
			            		}
			            	}
			            });
		            }
		        }
	          	
	          	var payroll_product = {
		            agency_id: {
		              "_id" : agency.id,
		              "name" : agency.name
		            },
		            branch_id: branch,
		            consultant_id: consultant,
		            agency_ref: value.agency_ref,
		            margin: value.margin,
		            margin_fixed: value.margin_fixed,
		            holiday_pay_rule: value.holiday_pay_rule,
		            derogation_contract: value.derogation_contract,
		            derogation_spread: value.derogation_spread,
		            service_used: value.service_used,
		            payment_terms: value.payment_terms,
		            payment_method: value.payment_method,
		            job_description: value.job_description,
		            created_date: value.created_date,
		            _id: value.id,
		            margin_exception: value.margin_exception
	         	};
	          	payroll_products.push(payroll_product);
	        });
			resolve(payroll_products);
	    },reject);
	});
}

service.updatePayrollTaxDetails=function(user_id, payrollTaxDetails){
	var deff=Q.defer();
	candidatecommonservice.getUser(user_id)
	   .then(function(user){
	   		if(user){
   				var worker = user.worker;
   				utils.updateSubModel(user.worker.tax_detail,{ni_number:payrollTaxDetails.ni_number});
   				utils.updateSubModel(user.worker,{start_date:payrollTaxDetails.start_date});
   				// worker.tax_detail.ni_number = payrollTaxDetails.ni_number;
   				// worker.start_date = payrollTaxDetails.start_date;
   				var props = utils.updateSubModel(user.worker.payroll_tax, payrollTaxDetails);
   				console.log(user);
				return Q.nfcall(user.save.bind(user)).then(function(result){
					deff.resolve(user);						
				}, deff.reject);
	   		} else {
	   			deff.reject({name:'NotFound', message:'No Payroll Tax detail found'});
	   		}
	}, deff.reject);
   	return deff.promise;
}

service.updatePayrollProductDetails=function(user_id, payrollProductDetails){
	var deff=Q.defer();

	candidatecommonservice.getUser(user_id)
	   .then(function(user){
	   		if(user){
	   			var product;
   				if(payrollProductDetails._id == "" || payrollProductDetails._id == undefined){
   					console.log('add');
   					delete payrollProductDetails['_id'];
   					payrollProductDetails['created_date'] = new Date();
   					user.worker.payroll_product.push(payrollProductDetails);
   					console.log(payrollProductDetails);
   					product=user.worker.payroll_product[user.worker.payroll_product.length-1];

   				}else{
   					console.log('edit');
   					//REVIEW: First get the existing product then update it.
   					product=user.worker.payroll_product.id(payrollProductDetails._id);
   					if(product){
   						payrollProductDetails['updated_date'] = new Date();
   						utils.updateSubModel(user.worker.payroll_product.id(payrollProductDetails._id),payrollProductDetails);
   					}
   					else{
   						return deff.reject({result:false,name:'NotFound',message:'Product not found'});
   					}

   					console.log('existing product');
   					console.log(payrollProductDetails);
   					console.log(product);
   		// 			user.worker.payroll_product.forEach(function(payroll_product_single, key){
					// 	if(payroll_product_single != null){
					// 		if(payroll_product_single._id == payrollProductDetails._id){
					// 			delete payrollProductDetails['_id'];
					// 			utils.updateSubModel(user.worker.payroll_product[key], payrollProductDetails);
					// 			//REVIEW: missing return false; statement to stop the loop from continuing...without that statement your code will keep running for other items in the list too.
					// 		}
					// 	}
					// });
   				}

   				return Q.nfcall(user.save.bind(user)).then(function(result){
   						//REVIEW: return the updated product alongwith. When updating or creating new object it is essential to send the newly created or updated item back to the caller.
									deff.resolve({user:user,product:product});						
								}, deff.reject);
				
	   		} else {
	   			deff.reject({name:'NotFound',message:'No Payroll Product detail found'});
	   		}
	}, deff.reject);
   	return deff.promise;
}

service.deletePayrollProductDetails=function(candidateId, productId){
	var deff=Q.defer();
	candidatecommonservice.getUser(candidateId)
		.then(function(user){
			if(user){
				var products = user.worker.payroll_product;
				var product = user.worker.payroll_product.id(productId);
				
				// Get Index
				var index = products.indexOf(product);
				user.worker.payroll_product.splice(index, 1);

				return Q.nfcall(user.save.bind(user)).then(function(result){
					deff.resolve();						
				}, deff.reject);
			} else {
	   			deff.reject({name:'NotFound',message:'No Candidate found'});
	   		}
		}, deff.reject);
   	return deff.promise;
}

service.postMarginException = function(candidateId, productId, marginExceptionDetails){
	var deff=Q.defer();
	candidatecommonservice.getUser(candidateId)
		.then(function(user){
			if(user){
				user.worker.payroll_product.id(productId).margin_exception.push(marginExceptionDetails);
				return Q.nfcall(user.save.bind(user)).then(function(result){
					marginException = user.worker.payroll_product.id(productId).margin_exception;
					deff.resolve({object:marginException[marginException.length-1]});						
				}, deff.reject);
			} else {
	   			deff.reject({name:'NotFound',message:'No Candidate found'});
	   		}
		}, deff.reject);
   	return deff.promise;
}

service.patchMarginException = function(candidateId, productId, marginExceptionId, marginExceptionDetails){
	var deff=Q.defer();
	candidatecommonservice.getUser(candidateId)
		.then(function(user){
			if(user){
				console.log(marginExceptionId);
				utils.updateSubModel(user.worker.payroll_product.id(productId).margin_exception.id(marginExceptionId), marginExceptionDetails);
				return Q.nfcall(user.save.bind(user)).then(function(result){
					marginException = user.worker.payroll_product.id(productId).margin_exception.id(marginExceptionId);
					console.log(marginException);
					deff.resolve({object:marginException});						
				}, deff.reject);
			} else {
	   			deff.reject({name:'NotFound',message:'No Candidate found'});
	   		}
		}, deff.reject);
   	return deff.promise;
}

service.deleteMarginException = function(candidateId, productId, marginExceptionId){
	var deff=Q.defer();
	candidatecommonservice.getUser(candidateId)
		.then(function(user){
			if(user){
				marginException = user.worker.payroll_product.id(productId).margin_exception.id(marginExceptionId);
				var index = user.worker.payroll_product.id(productId).margin_exception.indexOf(marginException);
				user.worker.payroll_product.id(productId).margin_exception.splice(index, 1);
				return Q.nfcall(user.save.bind(user)).then(function(result){
					deff.resolve();						
				}, deff.reject);
			} else {
	   			deff.reject({name:'NotFound',message:'No Candidate found'});
	   		}
		}, deff.reject);
   	return deff.promise;
}

module.exports=service;