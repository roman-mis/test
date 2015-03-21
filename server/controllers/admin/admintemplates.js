'use strict';
var controller={};
module.exports = function(){
	var adminTemplatesService=require('../../services/admin/admintemplatesservice');

	controller.saveTemplate = function(req,res){

		var templateContent = {

			templateType: 	req.body.templateType,
			name: 			req.body.name,
			subType: 		req.body.subType,
			templateBody: 	req.body.templateBody,
			title: 			req.body.title
		};
		adminTemplatesService.saveTemplate(templateContent).then(
			function(){
				console.log('done!');
				res.json({result:true, object:'vm'});
			},
			res.sendFailureResponse);
	};

	controller.getAlladminTemplates=function (req,res){
		adminTemplatesService.getAllAdminTemplates(req._restOptions)
	  	.then(function(result){
	  		console.log('we are getting result from here');
	  		console.log(result);

		    var pagination=req._restOptions.pagination||{};
		    var resp={result:true,objects:result.rows, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:result.count}};
	    	console.log(resp);
		    res.json(resp);
	  	},res.sendFailureResponse);
	};


	controller.getAdminTemplate = function(req,res){
		console.log(req.params.id);
		adminTemplatesService.getAdminTemplate(req.params.id)
		.then(function(adminTemplate){
			if(adminTemplate){
				console.log('******************');
				adminTemplate.x= 'hello';
				console.log(adminTemplate);
				res.json({result:true, object: adminTemplate});
			}else{
				res.json({result:false, object: null});
			}
		},res.sendFailureResponse);
	};

	controller.deleteAdminTemplate=function(req,res){
		console.log(req.params.id);
		adminTemplatesService.deleteAdminTemplate(req.params.id)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	};


	controller.updateAdminTemplate=function(req,res){
		console.log('hello from updateAdminTemplate');
		console.log(req.params.id);
		var templateContent = {
			templateType: 	req.body.templateType,
			name: 			req.body.name,
			subType: 		req.body.subType,
			templateBody: 	req.body.templateBody,
			title: 			req.body.title,
			updatedDate: Date.now()
		};
		// console.log('*************************')
		// console.log(Date.now);
		// console.log(Date.now());
		adminTemplatesService.updateAdminTemplate(req.params.id,templateContent)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	};

	return controller;
};
