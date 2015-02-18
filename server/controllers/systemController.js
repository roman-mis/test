'use strict';


module.exports = function(){
	var systemservice = require('../services/systemservice')(),
		_ = require('lodash');

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

		controller.patchPaymentRates=function (req, res) {
			savePaymentRates(req, res, 'patch');
		};

		controller.postPaymentRates=function (req, res) {
			savePaymentRates(req, res, 'post');
		};

		function savePaymentRates(req, res, type){
			var paymentInfo=req.body;

			systemservice.savePaymentRates(type==='patch'?req.params.id:null, paymentInfo)
			.then(function(paymentRates){
				res.json({result:true, object:paymentRates});
			},function(err){
			 	res.sendFailureResponse(err);
			});
		}

		controller.getVat=function (req,res){
			systemservice.getSystem()
		  	.then(function(result){
		  		res.json({result:true, objects:result.statutoryTables.vat});
		  	},function(err){
		  		res.sendFailureResponse(err);
		  	});
		};

		controller.getCurrentVat=function (req,res){
			systemservice.getSystem()
		  	.then(function(system){
		  		var currentDate = new Date();
				var currentVat; console.log(system);
				_.forEach(system.statutoryTables.vat, function(_vat){
					console.log(_vat);
					if(currentDate >= _vat.validFrom && currentDate <= _vat.validTo){
						currentVat = _vat;
						return false;
					}
				});
		  		res.json({result:true, object:currentVat});
		  	},function(err){
		  		res.sendFailureResponse(err);
		  	});
		};

		controller.patchVat=function (req, res) {
			saveVat(req, res, 'patch');
		};

		controller.postVat=function (req, res) {
			saveVat(req, res, 'post');
		};

		function saveVat(req, res, type){
			var paymentInfo=req.body;

			systemservice.saveVat(type==='patch'?req.params.id:null, paymentInfo)
			.then(function(vat){
				res.json({result:true, object:vat});
			},function(err){
			 	res.sendFailureResponse(err);
			});
		}

		function getSystemVm(system){
			return system;
		}

 return controller;
};

