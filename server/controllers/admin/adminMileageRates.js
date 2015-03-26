'use strict';
var controller={};
module.exports = function(dbs){

	var systemservice = require('../../services/systemservice')(dbs),
	adminMileageRatesService = require('../../services/admin/adminMileageRatesService')(dbs);
    
    controller.getMileageRates= function(req, res) {
        systemservice.getSystem()
	  	.then(function(system){
	  		console.log('system');
	  		console.log(system);
	  		var mileageRatesVm=getMileageRatesVm(system);
		    res.json({result:true, objects:mileageRatesVm});
	  	},function(err){
	  		res.sendFailureResponse(err);
	  	});    
    };
    controller.saveMileageRates= function(req, res) {
        var mileageRatesInfo=req.body; 
        console.log(mileageRatesInfo);
		adminMileageRatesService.saveMileageRates(mileageRatesInfo).then(function(system){
			var mileageRatesVm=getMileageRatesVm(system);
		    res.json({result:true, object:mileageRatesVm});
		},function(err){
		 	res.sendFailureResponse(err);
		});  
    };

    function getMileageRatesVm(system){
    	console.log('-----------------------------------------------------------------------------**');
    	console.log(system.mileageRates.amount);
    	return system.mileageRates;
    }

	return controller;
};