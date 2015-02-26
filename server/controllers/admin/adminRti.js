'use strict';
var controller={};
module.exports = function(dbs){

	var systemservice = require('../../services/systemservice')(dbs),
		adminRtiService = require('../../services/admin/adminRtiService')(dbs);
 
    controller.getRti=function(req, res) {
        systemservice.getSystem()
	  	.then(function(system){
	  		var rtiVm=getRtiVm(system);
		    res.json({result:true, object:rtiVm});
	  	},function(err){
	  		res.sendFailureResponse(err);
	  	});    
    };
    controller.saveRti=function(req, res) {
        var rtiInfo=req.body;

		adminRtiService.saveRti(rtiInfo).then(function(system){
			var rtiVm=getRtiVm(system);
		    res.json({result:true, object:rtiVm});
		},function(err){
		 	res.sendFailureResponse(err);
		});  
    };

    function getRtiVm(system){
    	return system.rti;
    }

return controller;
};