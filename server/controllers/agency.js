'use strict';


var awsservice=require('../services/awsservice');

var controller={};
module.exports = function(dbs){
	var express = require('express'),
    jwt = require('jsonwebtoken'),
	db = dbs,
	router = express.Router(),
	agencyservice=require('../services/agencyservice'),
	utils=require('../utils/utils'),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	// urlhelper=require('../middlewares/urlhelper'),
	fs=require('fs'),
	path=require('path'),
	dataList=require('../data/data_list.json'),
	awsService=require('../services/awsservice'),
	dataList=require('../data/data_list.json'),
	userservice=require('../services/userservice');


	controller.getFileSignedUrl=function(req,res){
		var folder=process.env.S3_AGENCY_FOLDER+req.params.id+'/';
		 awsService.getS3SignedUrl('getObject', req.params.fileName,null,folder,{Expires:500})
	    .then(function(returnData){
	        res.json(returnData);
	       
	    },res.sendFailureResponse);

	}
	controller.getFileRedirectUrl=function(req,res){
		var folder=process.env.S3_AGENCY_FOLDER+req.params.id+'/';
		 awsService.getS3SignedUrl('getObject', req.params.fileName,null,folder,{Expires:500})
	    .then(function(returnData){
	        res.redirect(returnData.signedRequest);
	       
	    },res.sendFailureResponse);

	}
	controller.getFile=function(req,res){
		
		  var exten=path.extname(req.params.fileName);
		  //console.log(res);
		  //return;
		  var newFileName=req.params.fileName;
		  var folder=process.env.S3_AGENCY_FOLDER+req.params.id+'/';
		  console.log('retrieving file from aws '+newFileName);
		  awsservice.getS3Object(newFileName,folder)
		    .then(function(data){
		     	utils.sendFileData(res,data);
		    },res.sendFailureResponse);

	}

	controller.getAgencyLogoUploadSignedUrl=function(req,res){
		 var objectName=req.query.fileName;
	        var objectType=req.query.mimeType;
	        // var documentUpload=req.query.documentUpload||false;
	        var folder=process.env.S3_AGENCY_FOLDER+req.params.id+'/';

	    awsService.getS3SignedUrl('putObject', objectName,objectType,folder)
	    .then(function(returnData){
	        res.json(returnData);
	       
	    },res.sendFailureResponse);
	}

	controller.getAllAgency=function (req,res){
		agencyservice.getAllAgencies(req._restOptions)
	  	.then(function(result){
		    console.log('getAllAgency over');
		    // console.log(result.rows);
		    
		    var ao = [];
		  	result.rows.forEach(function(a){
		  		var agency=getAgencyVm(a);
		  		ao.push(agency);
			});
		    
		    var pagination=req._restOptions.pagination||{};
	    	var resp={result:true,objects:ao, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:result.count}};
	    
		    res.json(resp);
	  	},function(err){

	  	});
	}

	controller.getAgency=function(req,res){
		agencyservice.getAgency(req.params.id)
			.then(function(agency){
				var vm=getAgencyVm(agency);
				res.json({result:true, object:vm});
			},res.sendFailureResponse);
	}

	controller.postAgency=function (req, res) {
		saveAgency(req, res, 'post');
	}

	controller.patchAgency=function (req, res) {
		saveAgency(req, res, 'patch');
	}

	function saveAgency(req, res, type){
		var agencyDetails = {
			name: req.body.name,
			// agencyType: req.body.agencyType,
	  		address1: req.body.address1,			
	  		address2: req.body.address2,			
	  		address3: req.body.address3,			
	  		town: req.body.town,				
	  		country: req.body.country,			
	  		postCode: req.body.postCode,		
	  		companyRegNo: req.body.companyRegNo,	
	  		companyVatNo: req.body.companyVatNo,
	  		logoFileName:req.body.logoFileName
		};

		agencyservice.saveAgency(agencyDetails, (type == 'patch'?req.params.id:null)).then(function(result){
			//REVIEW: using vm here too
			var vm = getAgencyVm(result.agency);
			res.json({result:true, object:vm});
			// res.json({result:true, object:response});
		},function(err){
		 	res.sendFailureResponse(err);
		});
	}

	controller.getAgencyContact=function(req,res){
		agencyservice.getAgency(req.params.id)
			.then(function(agency){
				var vm=getAgencyContactVm(agency);
				res.json({result:true, object:vm});
			},res.sendFailureResponse);
	}

	controller.patchAgencyContact=function (req, res) {
		var contactDetails = {
			phone1: req.body.phone1,
	  		phone2: req.body.phone2,
	  		fax: req.body.fax,
	  		facebook: req.body.facebook,
	  		linkedin: req.body.linkedin,
	  		website: req.body.website,
	  		email: req.body.email,
	  		logo: req.body.logo
		}

		agencyservice.saveAgencyContact(req.params.id, contactDetails).then(function(agency){
			var vm=getAgencyContactVm(agency);
			res.json({result:true, object:vm});
		},function(err){
		 	res.sendFailureResponse(err);
		});
	}

	function getAgencyContactVm(agency){
		return{
			phone1: agency.contactInformation.phone1,
	  		phone2: agency.contactInformation.phone2,
	  		fax: agency.contactInformation.fax,
	  		facebook: agency.contactInformation.facebook,
	  		linkedin: agency.contactInformation.linkedin,
	  		website: agency.contactInformation.website,
	  		email: agency.contactInformation.email,
	  		logo: agency.contactInformation.logo
		}
	}

	controller.getBranch = function(req,res){
		agencyservice.getBranch(req.params.id)
		.then(function(branch){
			if(branch){
				res.json({result:true, object: getBranchVm(branch)});
			}else{
				res.json({result:false, object: null});
			}
		},res.sendFailureResponse);
	}

	controller.getConsultant = function(req,res){
		agencyservice.getConsultant(req.params.id)
			.then(function(consultant){
				if(consultant){
					var consultantVm=getConsultantVm(consultant);
					res.json({result:true, object: consultantVm});
				}
				else{
					res.json({result:false,message:'Consultant not found'});
				}
				
			},res.sendFailureResponse);
	}

	controller.getBranches=function(req,res){
		agencyservice.getBranches({'agency':req.params.id})
		.then(function(branches){
			console.log('branches here');
			console.log(branches);
			var allBranchVms=_.map(branches, function(branch,key){
				var con=getBranchVm(branch);
				return con;
			});

			res.json({result:true, objects: allBranchVms});
		},res.sendFailureResponse);
	}

	controller.postBranch=function(req,res){
		var branchInfo={
			name: 				 req.body.name,
			address1:            req.body.address1,
	    	address2:            req.body.address2,
	    	address3:            req.body.address3,
			town:                req.body.town,
	    	postCode:            req.body.postCode,
	    	branchType: 		 "BRANCH"
		}
		agencyservice.postBranch(req.params.id, branchInfo)
			.then(function(response){
				res.json({result:true,object:getBranchVm(response.object.branch)});
			},res.sendFailureResponse);
	}

	controller.patchBranch=function(req,res){
		var branchInfo={
			name: 				 req.body.name,
			address1:            req.body.address1,
	    	address2:            req.body.address2,
	    	address3:            req.body.address3,
			town:                req.body.town,
	    	postCode:            req.body.postCode
		}
		agencyservice.patchBranch(req.params.id, branchInfo)
			.then(function(response){
				res.json({result:true,object:getBranchVm(response.object.branch)});
			},res.sendFailureResponse);
	}

	controller.deleteBranch=function(req,res){
		agencyservice.deleteBranch(req.params.id)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	}

	controller.getConsultants=function(req,res){
		agencyservice.getAgencyByBranchId(req.params.branchid)
			.then(function(agency){
				var allConsultantVms=_.map(agency.branches.id(req.params.branchid).consultants,function(consultant,idx){
					var con=getConsultantVm(consultant);
					return con;
				});

				res.json({result: true, objects: allConsultantVms});
			},res.sendFailureResponse);
	}

	controller.postConsultant=function(req,res){
		var consultantInfo={
			firstName: 		  req.body.firstName,
			lastName: 		  	  req.body.lastName,
			emailAddress:        req.body.emailAddress,
	    	phone:        req.body.phone,
	    	role:         req.body.role,
	    	status:       req.body.status
		}
		agencyservice.postConsultant(req.params.branchid, consultantInfo)
			.then(function(response){
				var consultant = response.object.consultant;
				consultant.user = response.object.user
				var consultantVm=getConsultantVm(consultant);
				res.json({result:true,object:consultantVm});
			},res.sendFailureResponse);
	}

	controller.patchConsultant=function(req, res){
		var consultantInfo={
			firstName: 		  req.body.firstName,
			lastName: 		  	  req.body.lastName,
			emailAddress:        req.body.emailAddress,
	    	phone:        req.body.phone,
	    	role:         req.body.role,
	    	status:       req.body.status
		}
		agencyservice.patchConsultant(req.params.id, consultantInfo)
			.then(function(response){
				console.log('response received ');
				var consultantVm=getConsultantVm(response.object.consultant);
				res.json({result:true,object:consultantVm});
			},res.sendFailureResponse);
	}

	controller.deleteConsultant=function(req,res){
		agencyservice.deleteConsultant(req.params.id)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	}

	function getAgencyVm(agency){
		//console.log(agency);
		return agency;
		// return {
		// 	_id:agency._id,
		// 	name:agency.name,
		// 	// agencyType: agency.agencyType,
		// 	address1: agency.address1,
		// 	address2: agency.address2,
		// 	address3: agency.address3,
		// 	town: agency.town,
		// 	country: agency.country,
		// 	postcode: agency.postcode,
		// 	companyRegNo: agency.companyRegNo,
		// 	companyVatNo: agency.companyVatNo
		// };
	}

	controller.getAgencyPayroll = function(req, res){
		agencyservice.getAgency(req.params.id).then(function(agency){
			// var vm = getAgencyPayrollVm(agency);
			// res.json({result:true, object:vm});

			getAgencyPayrollVm(agency)
	        .then(function(branch){
	          res.json(branch);
	        },res.sendFailureResponse);

		},res.sendFailureResponse);
	}

	controller.patchAgencyPayroll = function(req, res){
		var agencyId = req.params.id;
		var defaultInvoicingDetails = {
			holidayPayIncluded:       req.body.holidayPayIncluded,
			employersNiIncluded:      req.body.employersNiIncluded,
			invoiceVatCharged:        req.body.invoiceVatCharged,
			invoiceMethod:             req.body.invoiceMethod,
			invoiceDesign:             req.body.invoiceDesign,
			invoiceEmailPrimary:      req.body.invoiceEmailPrimary,
			invoiceEmailSecondary:    req.body.invoiceEmailSecondary,
			paymentTerms:              req.body.paymentTerms,
			invoiceTo:                 req.body.invoiceTo
	    };
	    var defaultPayrollDetails = {
			productType:               req.body.productType,
			marginChargedToAgency:   req.body.marginChargedToAgency,
			marginType:                req.body.marginType,
			marginAmount:        		req.body.marginAmount,
			holidayAmount:             req.body.holidayAmount
	    }

	    agencyservice.saveAgencyPayroll(agencyId, defaultInvoicingDetails, defaultPayrollDetails).then(function(agency){
			// var vm = getAgencyPayrollVm(agency);
			// res.json({result: true, object: vm});

			getAgencyPayrollVm(agency,true)
	        .then(function(branch){
	          res.json(branch);
	        },res.sendFailureResponse);

		},function(err){
		 	res.sendFailureResponse(err);
		});
	}	

	controller.lockUnlockConsultant=function(req,res){
		agencyservice.lockUnlockConsultant(req.params.id,req.params.flag,req.user?req.user.id:null)
			.then(function(response){
				if(response.result){
					// console.log('User found:');
					// console.log(consultant);
					res.json({result:true});
					//return false;
				}
				else{
					res.json({result:false,message:response.message});	
				}
				
				
			},res.sendFailureResponse);
	}

	controller.changeConsultantPassword=function(req,res){
		agencyservice.getConsultant(req.params.id)
			.then(function(consultant){

				if(	consultant.user){
					console.log('consultant found');
					// console.log(consultant);
					return userservice.sendChangePasswordEmail(consultant.user._id,req.user._id)
					.then(function(response){
						if(response.result){
							res.json({result:true,message:'Change password link sent successfully'});
						}
						else{
							res.json({result:false,message:response.message});	
						}
					},res.sendFailureResponse);
				}
				else{
					res.sendFailureResponse({result:false,name:'NOTFOUND',message:'User profile not found'});
				}
			},res.sendFailureResponse)
			.catch(function(err){
				console.log('ERROR');
				console.log(err);
			});
		
	}


	function getAgencyPayrollVm(agencyOld,reload){
      	return Q.Promise(function(resolve,reject){
      		console.log('getting agency again for payroll vm');
	      	if(reload){
	      		return agencyservice.getAgency(agencyOld._id)
	      		.then(function(agency){
	      			console.log('got agency again....');
				
	      			build(agency);

	      		},reject);
	      	}
	      	else{
	      		build(agencyOld);
	      	}
	      	
			function build(agency){
				
				var invoiceDesign=agency.defaultInvoicing.invoiceDesign||{};

				var invoiceTo=utils.findInArray(agency.branches,agency.defaultInvoicing.invoiceTo,"_id")||{};


				var payrollVm={
				_id: agency._id,
				name: agency.name,
				defaultInvoicing:{
				  holidayPayIncluded:       agency.defaultInvoicing.holidayPayIncluded,
				  employersNiIncluded:      agency.defaultInvoicing.employersNiIncluded,
				  invoiceVatCharged:        agency.defaultInvoicing.invoiceVatCharged,
				  invoiceMethod:             utils.findInArray(dataList.InvoiceMethods, agency.defaultInvoicing.invoiceMethod, 'code'),
				  invoiceDesign: {
				  	_id: invoiceDesign._id,
				  	name: invoiceDesign.name
				  },
				  invoiceEmailPrimary:      agency.defaultInvoicing.invoiceEmailPrimary,
				  invoiceEmailSecondary:    agency.defaultInvoicing.invoiceEmailSecondary,
				  paymentTerms:              utils.findInArray(dataList.PaymentTerms, agency.defaultInvoicing.paymentTerms, 'code'),
				  invoiceTo: {
				  	_id: invoiceTo._id,
				  	name: invoiceTo.name
				  }
				},
				defaultPayroll:{
				  productType:               utils.findInArray(dataList.ServiceUsed, agency.defaultPayroll.productType, 'code'),
				  marginChargedToAgency:   agency.defaultPayroll.marginChargedToAgency,
				  marginType:                utils.findInArray(dataList.MarginTypes, agency.defaultPayroll.marginType, 'code'),
				  marginAmount:        	  agency.defaultPayroll.marginAmount,
				  holidayAmount:             agency.defaultPayroll.holidayAmount
				}


				};

				resolve({result:true, object: payrollVm});
			}
	      		
	      	
	        
      	});
      	
    }

	function getAgencyPayrollVm_(agency){
		
		return {
			_id: agency._id,
			name: agency.name,
			defaultInvoicing:{
		      holidayPayIncluded:       agency.defaultInvoicing.holidayPayIncluded,
		      employersNiIncluded:      agency.defaultInvoicing.employersNiIncluded,
		      invoiceVatCharged:        agency.defaultInvoicing.invoiceVatCharged,
		      invoiceMethod:             utils.findInArray(dataList.InvoiceMethods, agency.defaultInvoicing.invoiceMethod, 'code'),
		      invoiceDesign:             agency.defaultInvoicing.invoiceDesign,
		      invoiceEmailPrimary:      agency.defaultInvoicing.invoiceEmailPrimary,
		      invoiceEmailSecondary:    agency.defaultInvoicing.invoiceEmailSecondary,
		      paymentTerms:              utils.findInArray(dataList.PaymentTerms, agency.defaultInvoicing.paymentTerms, 'code'),
		      invoiceTo:                 agency.defaultInvoicing.invoiceTo
		    },
		    defaultPayroll:{
		      productType:               utils.findInArray(dataList.ServiceUsed, agency.defaultPayroll.productType, 'code'),
		      marginChargedToAgency:   agency.defaultPayroll.marginChargedToAgency,
		      marginType:                utils.findInArray(dataList.MarginTypes, agency.defaultPayroll.marginType, 'code'),
		      marginAmount:        	  agency.defaultPayroll.marginAmount,
		      holidayAmount:             agency.defaultPayroll.holidayAmount
		    }
		};
	}

	controller.getAgencySales = function(req, res){
		agencyservice.getAgency(req.params.id).then(function(agency){
			var vm = getAgencySalesVm(agency);
			res.json({result:true, object:vm});
		},res.sendFailureResponse);
	}

	controller.patchAgencySales = function(req, res){
		var agencyId = req.params.id;
		var salesDetails = {
			leadSales:       			req.body.leadSales,
			accountManager:      		req.body.accountManager,
			commissionProfile:         req.body.commissionProfile
	    };
	    var administrationCostDetails = {
			perReferral:               req.body.perReferral,
			perTimesheet:   			req.body.perTimesheet,
			timesheetGross:            req.body.timesheetGross
	    }

		agencyservice.saveAgencySales(agencyId, salesDetails, administrationCostDetails).then(function(agency){
			var vm = getAgencySalesVm(agency);
			res.json({result: true, object: vm});
		},function(err){
		 	res.sendFailureResponse(err);
		});
	}

		
	function getAgencySalesVm(agency){
		console.log(agency);
		return {
			_id: agency._id,
			name: agency.name,
			sales:{
		      leadSales:       	agency.sales.leadSales,
		      accountManager:      agency.sales.accountManager,
		      commissionProfile:   agency.sales.commissionProfile
		    },
		    administrationCost:{
		      perReferral:         agency.administrationCost.perReferral,
		      perTimesheet:   		agency.administrationCost.perTimesheet,
		      timesheetGross:      agency.administrationCost.timesheetGross
		    }
		};
	}

	function getBranchVm(branch){
		var allConsultantVms=_.map(branch.consultants,function(consultant, key){
			var con=getConsultantVm(consultant);
			return con;
		});

		return{
			_id: branch._id,
			name: branch.name,
		    address1: branch.address1,
		    address2: branch.address2,
		    address3: branch.address3,
			town: branch.town,
		    postCode: branch.postCode,
		    branchType: branch.branchType,
		    consultants: allConsultantVms
		};
	}

	function getConsultantVm(consultant){
		var user=consultant.user||{};
		var contactDetail=user.contactDetail||{};
		var status=utils.findInArray(dataList.StatusList,consultant.status,"code")||{};
		var role=utils.findInArray(dataList.RolesList,consultant.role,"code")||{};
		return { 
			_id: consultant._id, 
			emailAddress: consultant.emailAddress,
			phone:consultant.phone,
			firstName: consultant.firstName, 
			lastName: consultant.lastName, 
			locked: user.locked,
			user:user._id,role:role,status:status
		};
	}

  return controller;
};
