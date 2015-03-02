'use strict';


module.exports = function(){
	var _=require('lodash');
	var templateservice=require('../../services/admin/importExportTemplates');
	var controller={};

	


controller.getAllTemplates=function (req,res){
		templateservice.getAllTemplates(req._restOptions)
	  	.then(function(result){
		    console.log('result')
		    console.log(result)
		    var pagination=req._restOptions.pagination||{};
		    var resp={result:true,objects:result.rows, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:result.count}};
	    	console.log(resp);
		    res.json(resp);
	  	},res.sendFailureResponse);
	};


	controller.postTemplate=function (req, res) {
		console.log(req.body);

		var newTemplate={
			templateName: req.body.templateName,
			templateType: req.body.templateType,
			items: req.body.items
		};

		templateservice.addTemplate(newTemplate).then(function(response){
			var vm = getTemplateVm(response);
			res.json({result:true, object:vm});
		},function(err){
		 	res.sendFailureResponse(err);
		});
	};

	controller.getTemplate=function(req,res){
		templateservice.getTemplate(req.params.id)
			.then(function(template){
				var vm = getTemplateVm(template);
				res.json({result:true, object:vm});
			},res.sendFailureResponse);
	};

	controller.deleteTemplate=function(req,res){
		console.log(req.params.id);
		templateservice.deleteTemplate(req.params.id)
			.then(function(response){
				res.json(response);
			},res.sendFailureResponse);
	};

  return controller;
};
