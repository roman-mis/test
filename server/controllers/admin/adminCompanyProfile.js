'use strict';
var controller={};
module.exports = function(){
	//var Q = require('q');
	var db = require('../../models');
	var utils=require('../../utils/utils');
	var dataList=require('../../data/data_list.json');
	var systemservice = require('../../services/systemservice')(db),
	adminCompanyProfileService = require('../../services/admin/adminCompanyProfileservice')(db);
	

	controller.getAdminCompanyProfile= function(req, res) {
        systemservice.getSystem()
	  	.then(function(system){
	  		var companyProfile=getCompanyProfileVm(system);
		    res.json({result:true, companyProfile:companyProfile});
	  	})
	  	.then(null, function(err){
	  		res.sendFailureResponse(err);
	  		console.log(err);
	  	});    
    };


	controller.saveAdminCompanyProfile = function(req, res){
		adminCompanyProfileService.saveAdminCompanyProfile(req.params.name,req.body)
		.then(function(){
		    res.json({result:true});
		},function(err){
			console.log(err + 'err');
			res.sendFailureResponse(err);
		});
	};       

	return controller;


function getCompanyProfileVm(system){
    	console.log('-----------------------------------------------------------------------------**');
    	
    	var companyProfileVm ={
    		contact :{
    			companyName : system.companyProfile.contact.companyName,
    			address1 : system.companyProfile.contact.address1,
    			address2 : system.companyProfile.contact.address2,
    			town : system.companyProfile.contact.town,
    			country : system.companyProfile.contact.country,
                postcode : system.companyProfile.contact.postcode,
                telephone : system.companyProfile.contact.telephone,
    			fax : system.companyProfile.contact.fax,
    			email : system.companyProfile.contact.email,
    		},

    		accounts: {
    			utrNumber : system.companyProfile.accounts.utrNumber,
    			taxDistrictNo : system.companyProfile.accounts.taxDistrictNo,
    			accountsOfficeRef : system.companyProfile.accounts.accountsOfficeRef,
    			vatNumber : system.companyProfile.accounts.vatNumber,
    			companyRegNo : system.companyProfile.accounts.companyRegNo,
    			payeRef : system.companyProfile.accounts.payeRef
    		},

    		bankDetails: {
    			address1 : system.companyProfile.bankDetails.address1,
    			address2 : system.companyProfile.bankDetails.address2,
    			town : system.companyProfile.bankDetails.town,
    			county : system.companyProfile.bankDetails.county,
    			country : system.companyProfile.bankDetails.country,
    			bankName : system.companyProfile.bankDetails.bankName,
    			postcode : system.companyProfile.bankDetails.postcode,
    			accountName : system.companyProfile.bankDetails.accountName,
    			accountNo : system.companyProfile.bankDetails.accountNo,
    			sortCode : system.companyProfile.bankDetails.sortCode,
    			payrollRef : system.companyProfile.bankDetails.payrollRef
    		},

    		defaults: {
	    		payFrequency : utils.findInArray(dataList.PayFrequency,system.companyProfile.defaults.payFrequency,'code'),
	    		holidayPayRule : utils.findInArray(dataList.HolidayPayRule,system.companyProfile.defaults.holidayPayRule,'code'),
	    		paymentMethod : utils.findInArray(dataList.PaymentMethod,system.companyProfile.defaults.paymentMethod,'code'),
	    		adminFee : utils.findInArray(dataList.AdminFee,system.companyProfile.defaults.adminFee,'code'),
	    		derogationContract : utils.findInArray(dataList.DerogationContract,system.companyProfile.defaults.derogationContract,'code'),
	    		communicationMethod : utils.findInArray(dataList.CommunicationMethod,system.companyProfile.defaults.communicationMethod,'code'),
	    		contractorStatus : utils.findInArray(dataList.ContractorStatus,system.companyProfile.defaults.contractorStatus,'code'),
	    		derogationSpreadWeeks : system.companyProfile.defaults.derogationSpreadWeeks,
	    		taxCodeContractors : system.companyProfile.defaults.taxCodeContractors
    		}
    	};
    	return companyProfileVm;		
    }

};



















/*'use strict';
var controller={};
module.exports = function(){
	//var Q = require('q');
	var db = require('../../models');
	var utils=require('../../utils/utils');
	var dataList=require('../../data/data_list.json');
	var systemservice = require('../../services/systemservice')(db),
	adminCompanyProfileService = require('../../services/admin/adminCompanyProfileservice')(db);
	

    controller.getAdminCompanyProfile= function(req, res) {
        systemservice.getSystem()
        .then(function(system){
            res.json({result:true, companyProfile:system});
        }).then(null,function(err){
            res.sendFailureResponse(err);
        });    
    };


	controller.saveAdminCompanyProfile = function(req, res){
		adminCompanyProfileService.saveAdminCompanyProfile(req.params.name,req.body)
		.then(function(){
		    res.json({result:true});
		},function(err){
			console.log(err + 'err');
			res.sendFailureResponse(err);
		});
	};       

	return controller;
}; */

