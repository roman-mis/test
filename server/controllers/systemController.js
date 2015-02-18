'use strict';


module.exports = function(){
	var systemservice=require('../services/systemservice')();

	var controller={};
		 
		controller.getSystem=function (req,res){
			systemservice.getSystem()
		  	.then(function(result){
		  		var systemVm=getSystemVm(result);
			    res.json({result:true, object:systemVm});
		  	},function(err){
		  		res.sendFailureResponse(err);
		  	});
		};

		controller.patchSystem=function (req, res) {
			var systemInfo=req.body;

			systemservice.saveSystem(systemInfo).then(function(system){
				res.json({result:true, object:system});
			},function(err){
			 	res.sendFailureResponse(err);
			});
		};

		controller.getPaymentRates=function (req,res){
			systemservice.getSystem()
		  	.then(function(result){
		  		res.json({result:true, objects:result.paymentRates});
		  	},function(err){
		  		res.sendFailureResponse(err);
		  	});
		};

		controller.postPaymentRates=function (req, res) {
			savePaymentRates(req, res, 'post');
		};

		function savePaymentRates(req, res, type){
			var paymentInfo=req.body;

			systemservice.savePaymentRates(type==='patch'?req.params.id:null, paymentInfo)
			.then(function(system){
				res.json({result:true, object:system.paymentRates});
			},function(err){
			 	res.sendFailureResponse(err);
			});
		}

		controller.patchPaymentRates=function (req, res) {
			savePaymentRates(req, res, 'patch');
		};

		function getSystemVm(system){
			return system;
		}

 return controller;
};

