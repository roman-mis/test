'use strict';
var controller={};
module.exports = function(){
	var adminStatutoryRatesService = require('../../services/admin/adminStatutoryRatesservice');

	controller.getAllAdminStatutoryRates = function(req, res){
		adminStatutoryRatesService.getAllAdminStatutoryRates()
		.then(function(result){
			console.log(result.statutoryTables);
			res.json({result: true, statutoryRates: result.statutoryTables});
		},function(err){
			res.sendFailureResponse(err);
		});
	};

	controller.addToAdminStatutoryRates = function(req, res){
		console.log('req.body', req.body);
		console.log('req.params', req.params);
		var type = req.params.type;
		adminStatutoryRatesService.addToAdminStatutoryRates(type, req.body).then(
			function(data){
				res.json({result:true, object:data});
			},
			function(err){
				console.log(err + 'err');
				res.sendFailureResponse(err);
			});
	};


	controller.saveAdminStatutoryRates = function(req, res){
		console.log('req.body', req.body);
		console.log('req.params', req.params);
		var type = req.params.type;
		adminStatutoryRatesService.saveAdminStatutoryRates(type, req.body).then(
			function(data){
				res.json({result:true, object:data});
			},
			function(err){
				console.log(err + 'err');
				res.sendFailureResponse(err);
			});
	};

	controller.editAdminStatutoryRates = function(req,res){
		adminStatutoryRatesService.editAdminStatutoryRates(req.params.id,req.body)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	};

	controller.deleteFromAdminStatutoryRates = function(req, res){
		console.log('req.params', req.params);
		var type = req.params.type;
		var id = req.params.id;
		adminStatutoryRatesService.deleteFromAdminStatutoryRates(type, id).then(
			function(data){
				res.json({result:true, object:data});
			},
			function(err){
				console.log(err + 'err');
				res.sendFailureResponse(err);
			});
	};

	return controller;
};