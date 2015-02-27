'use strict';
var controller={};
module.exports = function(){
	var adminCompanyProfileService = require('../../services/admin/adminCompanyProfileservice');

	controller.getAllAdminCompanyProfile = function(req, res){
		adminCompanyProfileService.getAllAdminCompanyProfile(req._restOptions)
		.then(function(result){
			var pagination=req._restOptions.pagination||{};
			var resp={result:true,objects:result.rows, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:result.count}};
			res.json({result: true, companyProfile: resp.objects[0].companyProfile, id: resp.objects[0]._id});
		},function(){
			res.sendFailureResponse;
		});
	};

	controller.saveAdminCompanyProfile = function(req, res){
		adminCompanyProfileService.saveAdminCompanyProfile(req.body).then(
			function(result){
				res.json({result:true, object:"vm"});
			},
			function(err){
				console.log(err + 'err')
				res.sendFailureResponse;
			});
	};

	controller.editAdminCompanyProfile = function(req,res){
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