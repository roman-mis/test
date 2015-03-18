'use strict';
var controller={};
module.exports = function(db){
	var Q = require('q');
	var db = require('../../models');
	var systemservice = require('../../services/systemservice')(db),
	adminCompanyProfileService = require('../../services/admin/adminCompanyProfileservice')(db);
	

	controller.getAdminCompanyProfile= function(req, res) {
        systemservice.getSystem()
	  	.then(function(system){
		    res.json({result:true, companyProfile:system});
	  	},function(err){
	  		res.sendFailureResponse(err);
	  	});    
    };


	controller.saveAdminCompanyProfile = function(req, res){
		adminCompanyProfileService.saveAdminCompanyProfile(req.params.name,req.body)
		.then(function(system){
		    res.json({result:true});
		},function(err){
			console.log(err + 'err');
			res.sendFailureResponse(err);
		});
	};       

	return controller;
};


