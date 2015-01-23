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
	data_list=require('../data/data_list.json'),
	awsService=require('../services/awsservice'),
	data_list=require('../data/data_list.json'),
	userservice=require('../services/userservice');


	controller.getFileSignedUrl=function(req,res){
		var folder=process.env.S3_AGENCY_FOLDER+req.params.id+'/';
		 awsService.getS3SignedUrl('getObject', req.params.file_name,null,folder,{Expires:500})
	    .then(function(return_data){
	        res.json(return_data);
	       
	    },res.sendFailureResponse);

	}
	controller.getFileRedirectUrl=function(req,res){
		var folder=process.env.S3_AGENCY_FOLDER+req.params.id+'/';
		 awsService.getS3SignedUrl('getObject', req.params.file_name,null,folder,{Expires:500})
	    .then(function(return_data){
	        res.redirect(return_data.signed_request);
	       
	    },res.sendFailureResponse);

	}
	controller.getFile=function(req,res){
		
		  var exten=path.extname(req.params.file_name);
		  //console.log(res);
		  //return;
		  var newFileName=req.params.file_name;
		  var folder=process.env.S3_AGENCY_FOLDER+req.params.id+'/';
		  console.log('retrieving file from aws '+newFileName);
		  awsservice.getS3Object(newFileName,folder)
		    .then(function(data){
		     	utils.sendFileData(res,data);
		    },res.sendFailureResponse);

	}

	controller.getAgencyLogoUploadSignedUrl=function(req,res){
		 var object_name=req.query.file_name;
	        var object_type=req.query.mime_type;
	        // var document_upload=req.query.document_upload||false;
	        var folder=process.env.S3_AGENCY_FOLDER+req.params.id+'/';

	    awsService.getS3SignedUrl('putObject', object_name,object_type,folder)
	    .then(function(return_data){
	        res.json(return_data);
	       
	    },res.sendFailureResponse);
	}

	controller.getAllAgency=function (req,res){
		console.log(global.base_url);
		agencyservice.getAllAgencies(req._restOptions)
	  	.then(function(result){
		    console.log('getAllAgency over');
		    // console.log(result.rows);
		    
		    var ao = [];
		  	result.rows.forEach(function(a){
		  		var agency=getAgencyVm(a);
		  		ao.push(agency);
		  		//REVIEW: using a function to transform model to proper json object
				// ao.push({id: a._id, name: a.name});
			});

		    // var resp={result:true, objects:ao};
		    
		    var pagination=req._restOptions.pagination||{};
	    	var resp={result:true,objects:ao, meta:{limit:pagination.limit,offset:pagination.offset,total_count:result.count}};
	    
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
			// agency_type: req.body.agency_type,
	  		address1: req.body.address1,			
	  		address2: req.body.address2,			
	  		address3: req.body.address3,			
	  		town: req.body.town,				
	  		country: req.body.country,			
	  		postcode: req.body.postcode,		
	  		company_reg_no: req.body.company_reg_no,	
	  		company_vat_no: req.body.company_vat_no,
	  		logo_file_name:req.body.logo_file_name
		};

		agencyservice.saveAgency(agencyDetails, (type == 'patch'?req.params.id:null)).then(function(agency){
			//REVIEW: using vm here too
			var vm = getAgencyVm(agency);
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
			//REVIEW: using vm here too
			var vm=getAgencyContactVm(agency);
			res.json({result:true, object:vm});
			// res.json({result:true, object:response});
		},function(err){
		 	res.sendFailureResponse(err);
		});
	}

	function getAgencyContactVm(agency){
		return{
			phone1: agency.contact_information.phone1,
	  		phone2: agency.contact_information.phone2,
	  		fax: agency.contact_information.fax,
	  		facebook: agency.contact_information.facebook,
	  		linkedin: agency.contact_information.linkedin,
	  		website: agency.contact_information.website,
	  		email: agency.contact_information.email,
	  		logo: agency.contact_information.logo
		}
	}

	controller.getBranch = function(req,res){
		agencyservice.getAgencyByBranchId(req.params.id)
		.then(function(agency){
			if(agency){
				res.json({result:true, object: getBranchVm(agency.branches.id(req.params.id))});
			}else{
				res.json({result:true, object: null});
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
		agencyservice.getAgency(req.params.id)
		.then(function(agency){
			var allBranchVms=_.map(agency.branches, function(branch,key){
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
	    	postcode:            req.body.postcode,
	    	branch_type: 		 "BRANCH"
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
	    	postcode:            req.body.postcode
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
			first_name: 		  req.body.first_name,
			last_name: 		  	  req.body.last_name,
			email_address:        req.body.email_address,
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
			first_name: 		  req.body.first_name,
			last_name: 		  	  req.body.last_name,
			email_address:        req.body.email_address,
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
		// 	// agency_type: agency.agency_type,
		// 	address1: agency.address1,
		// 	address2: agency.address2,
		// 	address3: agency.address3,
		// 	town: agency.town,
		// 	country: agency.country,
		// 	postcode: agency.postcode,
		// 	company_reg_no: agency.company_reg_no,
		// 	company_vat_no: agency.company_vat_no
		// };
	}

	controller.getAgencyPayroll = function(req, res){
		agencyservice.getAgency(req.params.id).then(function(agency){
			var vm = getAgencyPayrollVm(agency);
			res.json({result:true, object:vm});
		},res.sendFailureResponse);
	}

	controller.patchAgencyPayroll = function(req, res){
		var agency_id = req.params.id;
		var defaultInvoicingDetails = {
			holiday_pay_included:       req.body.holiday_pay_included,
			employers_ni_included:      req.body.employers_ni_included,
			invoice_vat_charged:        req.body.invoice_vat_charged,
			invoice_method:             req.body.invoice_method,
			invoice_design:             req.body.invoice_design,
			invoice_email_primary:      req.body.invoice_email_primary,
			invoice_email_secondary:    req.body.invoice_email_secondary,
			payment_terms:              req.body.payment_terms,
			invoice_to:                 req.body.invoice_to
	    };
	    var defaultPayrollDetails = {
			product_type:               req.body.product_type,
			margin_charged_to_agency:   req.body.margin_charged_to_agency,
			margin_type:                req.body.margin_type,
			margin_amount:        		req.body.margin_amount,
			holiday_amount:             req.body.holiday_amount
	    }

	    agencyservice.saveAgencyPayroll(agency_id, defaultInvoicingDetails, defaultPayrollDetails).then(function(agency){
			var vm = getAgencyPayrollVm(agency);
			res.json({result: true, object: vm});
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
					userservice.sendChangePasswordEmail(consultant.user._id,req.user._id)
					.then(function(response){
						if(response.result){
							res.json({result:true,message:'Change password link sent successfully'});
						}
						else{
							res.json({result:false,message:response.message});	
						}
					});
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

	function getAgencyPayrollVm(agency){
		return {
			_id: agency._id,
			name: agency.name,
			default_invoicing:{
		      holiday_pay_included:       agency.default_invoicing.holiday_pay_included,
		      employers_ni_included:      agency.default_invoicing.employers_ni_included,
		      invoice_vat_charged:        agency.default_invoicing.invoice_vat_charged,
		      invoice_method:             utils.findInArray(data_list.InvoiceMethods, agency.default_invoicing.invoice_method, 'code'),
		      invoice_design:             agency.default_invoicing.invoice_design,
		      invoice_email_primary:      agency.default_invoicing.invoice_email_primary,
		      invoice_email_secondary:    agency.default_invoicing.invoice_email_secondary,
		      payment_terms:              utils.findInArray(data_list.PaymentTerms, agency.default_invoicing.payment_terms, 'code'),
		      invoice_to:                 agency.default_invoicing.invoice_to
		    },
		    default_payroll:{
		      product_type:               utils.findInArray(data_list.ServiceUsed, agency.default_payroll.product_type, 'code'),
		      margin_charged_to_agency:   agency.default_payroll.margin_charged_to_agency,
		      margin_type:                utils.findInArray(data_list.MarginTypes, agency.default_payroll.margin_type, 'code'),
		      margin_amount:        	  agency.default_payroll.margin_amount,
		      holiday_amount:             agency.default_payroll.holiday_amount
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
		var agency_id = req.params.id;
		var salesDetails = {
			lead_sales:       			req.body.lead_sales,
			account_manager:      		req.body.account_manager,
			commission_profile:         req.body.commission_profile
	    };
	    var administrationCostDetails = {
			per_referral:               req.body.per_referral,
			per_timesheet:   			req.body.per_timesheet,
			timesheet_gross:            req.body.timesheet_gross
	    }

		agencyservice.saveAgencySales(agency_id, salesDetails, administrationCostDetails).then(function(agency){
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
		      lead_sales:       	agency.sales.lead_sales,
		      account_manager:      agency.sales.account_manager,
		      commission_profile:   agency.sales.commission_profile
		    },
		    administration_cost:{
		      per_referral:         agency.administration_cost.per_referral,
		      per_timesheet:   		agency.administration_cost.per_timesheet,
		      timesheet_gross:      agency.administration_cost.timesheet_gross
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
		    postcode: branch.postcode,
		    branch_type: branch.branch_type,
		    consultants: allConsultantVms
		};
	}

	function getConsultantVm(consultant){
		var user=consultant.user||{};
		var contact_detail=user.contact_detail||{};
		var status=utils.findInArray(data_list.StatusList,consultant.status,"code")||{};
		var role=utils.findInArray(data_list.RolesList,consultant.role,"code")||{};
		return { 
			_id: consultant._id, 
			email_address: consultant.email_address,
			phone:contact_detail.phone,
			first_name: consultant.first_name, 
			last_name: consultant.last_name, 
			locked: user.locked,
			user:user._id,role:role,status:status
		};
	}

  return controller;
};
