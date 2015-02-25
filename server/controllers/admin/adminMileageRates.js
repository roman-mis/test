'use strict';
var controller={};
module.exports = function(dbs){

	var systemservice = require('../../services/systemservice')(dbs),
	adminMileageRatesService = require('../../services/admin/adminMileageRatesService')(dbs);
    
    controller.getMileageRates= function(req, res) {
        systemservice.getSystem()
	  	.then(function(system){
	  		var mileageRatesVm=getMileageRatesVm(system);
		    res.json({result:true, object:mileageRatesVm});
	  	},function(err){
	  		res.sendFailureResponse(err);
	  	});    
    };
    controller.saveMileageRates= function(req, res) {
        var mileageRatesInfo=req.body;

		adminMileageRatesService.saveMileageRates(mileageRatesInfo).then(function(system){
			var mileageRatesVm=getMileageRatesVm(system);
		    res.json({result:true, object:mileageRatesVm});
		},function(err){
		 	res.sendFailureResponse(err);
		});  
    };

    function getMileageRatesVm(system){
    	return system.mileageRates;
    }

	return controller;
};