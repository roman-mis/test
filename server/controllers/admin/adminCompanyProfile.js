'use strict';
var controller={};
module.exports = function(){
	var adminCompanyProfileService = require('../../services/admin/adminCompanyProfileservice');

	controller.getAllAdminCompanyProfile = function(req, res){
		adminCompanyProfileService.getAllAdminCompanyProfile(req._restOptions)
		.then(function(result){
			var pagination=req._restOptions.pagination||{};
			var resp={result:true,objects:result.rows, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:result.count}};
			console.log(resp);
			res.json(resp);
		},function(){
			res.sendFailureResponse;
		});
	};

	controller.saveAdminCompanyProfile = function(req, res){
		adminCompanyProfileService.saveAdminCompanyProfile(req.body).then(
			function(result){
				console.log('done!');
				console.log(req.body);
				console.log(result);
				res.json({result:true, object:"vm"});
			},
			function(err){
				console.log(err + 'err')
				res.sendFailureResponse;
			});
	};

	controller.editAdminCompanyProfile = function(req,res){
		console.log(req.params.id);
		console.log(req.body);
		adminCompanyProfileService.editAdminCompanyProfile(req.params.id,req.body)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	};

	controller.deleteAdminCompanyProfile = function(req, res){
		res.json({'x': 'y'});
	};

	return controller;
}