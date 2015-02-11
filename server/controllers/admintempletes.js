'use strict';
var controller={};
module.exports = function(){
	var adminTemplatesService=require('../services/admintemplatesservice');

	controller.saveTemplate = function(req,res){
		
		var templateContent = {
			templateTechnique: 	req.body.templateTechnique,
			templateName: 		req.body.templateName,
			templateType: 		req.body.templateType,
			mergeFields: 		req.body.mergeFields,
			templatTitle: 		req.body.templatTitle,
			body: 				req.body.body
		}
		adminTemplatesService.saveTemplate(templateContent).then(
			function(result){
				console.log('done!')
				res.json({result:true, object:"vm"});
			},
			function(err){
				console.log(err + 'err')
				res.sendFailureResponse;
			})
	}

	controller.getAlladminTemplates=function (req,res){
		adminTemplatesService.getAllAdminTemplates(req._restOptions)
	  	.then(function(result){
		    
		    var pagination=req._restOptions.pagination||{};
		    var resp={result:true,objects:result.rows, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:result.count}};
	    	console.log(resp);
		    res.json(resp);
	  	},function(){
	  		res.sendFailureResponse;
	  	});
	};


	controller.getAdminTemplate = function(req,res){
		console.log(req.params.id)
		adminTemplatesService.getAdminTemplate(req.params.id)
		.then(function(adminTemplate){
			if(adminTemplate){
				console.log(adminTemplate)
				res.json({result:true, object: adminTemplate});
			}else{
				res.json({result:false, object: null});
			}
		},res.sendFailureResponse);
	};

	controller.deleteAdminTemplate=function(req,res){
		console.log(req.params.id)
		adminTemplatesService.deleteAdminTemplate(req.params.id)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	};


	controller.updateAdminTemplate=function(req,res){
		console.log('hello from updateAdminTemplate')
		console.log(req.params.id)
		var templateContent = {
			templateTechnique: 	req.body.templateTechnique,
			templateName: 		req.body.templateName,
			templateType: 		req.body.templateType,
			mergeFields: 		req.body.mergeFields,
			templatTitle: 		req.body.templatTitle,
			body: 				req.body.body
		}
		adminTemplatesService.updateAdminTemplate(req.params.id,templateContent)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	};

	return controller;
}