'use strict';
var controller={};
module.exports = function(dbs){
	var systemservice = require('../../services/systemservice')(dbs),
		adminCisVerificationService = require('../../services/admin/adminCisVerificationService')(dbs);

    controller.getCisVerification= function(req,res) {
    	systemservice.getSystem()
	  	.then(function(system){
	  		var cisVerificationVm=getCisVerificationVm(system);
		    res.json({result:true, object:cisVerificationVm});
	  	},function(err){
	  		res.sendFailureResponse(err);
	  	});
    };
    controller.saveCisVerifiation= function(req,res) {
        var cisVerifiationInfo=req.body;

		adminCisVerificationService.saveCisVerifiation(cisVerifiationInfo).then(function(system){
			var cisVerificationVm=getCisVerificationVm(system);
		    res.json({result:true, object:cisVerificationVm});
		},function(err){
		 	res.sendFailureResponse(err);
		});  
    };

    function getCisVerificationVm(system){
    	return system.cis;
    }

    return controller;
};