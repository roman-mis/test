'use strict';


module.exports=function(dbs){

	var db = dbs,
		Q=require('q'),
		_=require('lodash'),
		utils=require('../utils/utils'),
		candidatecommonservice=require(__dirname+'/candidatecommonservice')(db);
	var service={};

	service.getPayrollProductDetails = function(id){
		var query=db.User.findById(id)
			.populate('worker.payrollProduct.agency')
			.populate('worker.payrollProduct.branch')
			.populate('worker.payrollProduct.consultant')
			.populate('worker.payrollProduct.marginException.createdBy');

		return Q.Promise(function(resolve,reject){
		    return Q.nfcall(query.exec.bind(query))
		    .then(function(user){

		    	var payrollProducts = [];
				_.forEach(user.worker.payrollProduct, function(_payrollProduct){
		    		// Agency
		    		var agency = null;
		    		if(_payrollProduct.agency){
		    			agency = {_id: _payrollProduct.agency._id, name: _payrollProduct.agency.name};
		    		}
					
					// Branch
					var branch = null;
		    		if(_payrollProduct.branch){
		    			branch = {_id: _payrollProduct.branch._id, name: _payrollProduct.branch.name};
		    		}
		    		
		    		// Consultant
					var consultant = null;
		    		if(_payrollProduct.consultant){
		    			consultant = {_id: _payrollProduct.consultant._id, name: _payrollProduct.consultant.name};
		    		}

		    		// For Margin Exception
		          	var marginExceptionVms = [];
		          	if(_payrollProduct.marginException !== null && Array.isArray(_payrollProduct.marginException)){
		          		_.forEach(_payrollProduct.marginException, function(_marginException){
		          			var marginExceptionVm = {
	          					_id: _marginException._id,
	          					marginType: _marginException.marginType,
				                reason: _marginException.reason,
				                deductionType: _marginException.deductionType,
				                deductionDate: _marginException.deductionDate,
				                deductionPeriod: _marginException.deductionPeriod,
				                deductionNumberOfPayroll: _marginException.deductionNumberOfPayroll,
				                createdBy: {
				                	_id: _marginException.createdBy._id,
		          					firstName: _marginException.createdBy.firstName,
		          					lastName: _marginException.createdBy.lastName
				                },
				                createdDate: _marginException.createdDate
		          			};
		          			marginExceptionVms.push(marginExceptionVm);
		          		});
		          	}

		    		var payrollProduct = {
		    			_id: _payrollProduct._id,
		    			agency: agency,
		    			branch: branch,
		    			consultant: consultant,
		    			agencyRef: _payrollProduct.agencyRef,
			            margin: _payrollProduct.margin,
			            marginFixed: _payrollProduct.marginFixed,
			            holidayPayRule: _payrollProduct.holidayPayRule,
			            derogationContract: _payrollProduct.derogationContract,
			            derogationSpread: _payrollProduct.derogationSpread,
			            serviceUsed: _payrollProduct.serviceUsed,
			            paymentTerms:  _payrollProduct.paymentTerms,
			            paymentMethod: _payrollProduct.paymentMethod,
			            jobDescription: _payrollProduct.jobDescription,
			            marginException: marginExceptionVms
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

	   				utils.updateSubModel(user.worker.taxDetail,{niNumber:payrollTaxDetails.niNumber});
	   				utils.updateSubModel(user.worker,{startDate:payrollTaxDetails.startDate});
	   				utils.updateSubModel(user.worker.payrollTax, payrollTaxDetails);

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

	   				if(payrollProductDetails._id === '' || payrollProductDetails._id === undefined){
	   					console.log('add');
	   					delete payrollProductDetails._id;
	   					payrollProductDetails.createdDate = new Date();
	   					user.worker.payrollProduct.push(payrollProductDetails);
	   					console.log(payrollProductDetails);
	   					product=user.worker.payrollProduct[user.worker.payrollProduct.length-1];

	   					return Q.nfcall(user.save.bind(user)).then(function(){
							deff.resolve({user:user, product:product});						
						}, deff.reject);

	   				}else{
	   					console.log('edit');
	   					product=user.worker.payrollProduct.id(payrollProductDetails._id);
	   					if(product){
	   						payrollProductDetails.updatedDate = new Date();
	   						utils.updateSubModel(user.worker.payrollProduct.id(payrollProductDetails._id),payrollProductDetails);
	   						return Q.nfcall(user.save.bind(user)).then(function(){
								deff.resolve({user:user, product:product});						
							}, deff.reject);
	   					}
	   					else{
	   						return deff.reject({result:false,name:'NotFound',message:'Product not found'});
	   					}
	   				}


	   	// 			return Q.nfcall(user.save.bind(user)).then(function(result){
					// 	deff.resolve({user:user, product:product});						
					// }, deff.reject);

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

	return service;

};