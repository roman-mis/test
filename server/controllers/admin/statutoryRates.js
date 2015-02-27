'use strict';
var controller={};
module.exports = function(){
	var adminStatutoryRatesService = require('../../services/admin/adminStatutoryRatesservice');

	controller.getAllAdminStatutoryRates = function(req, res){
		adminStatutoryRatesService.getAllAdminStatutoryRates(req._restOptions)
		.then(function(result){
			var pagination = req._restOptions.pagination||{};
			var resp = {result:true,objects:result.rows, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:result.count}};
			res.json({result: true, statutoryRates: resp.objects[0].statutoryTables, id: resp.objects[0]._id});
		},function(){
			res.sendFailureResponse;
		});
	};

	controller.saveAdminStatutoryRates = function(req, res){
		adminStatutoryRatesService.saveAdminStatutoryRates(req.body).then(
			function(result){
				res.json({result:true, object:"vm"});
			},
			function(err){
				console.log(err + 'err');
				res.sendFailureResponse;
			});
	};

	controller.editAdminStatutoryRates = function(req,res){
		adminStatutoryRatesService.editAdminStatutoryRates(req.params.id,req.body)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	};

	controller.deleteAdminStatutoryRates = function(req, res){
		res.json({'x': 'y'});
	};

	return controller;
}