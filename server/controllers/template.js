'use strict';


module.exports = function(){
	var _=require('_');
	var templateservice=require('../services/templateservice');
	var controller={};

	controller.getAllTemplates=function (req,res){

		templateservice.getAllTemplates(req._restOptions)
	  	.then(function(result){
	  		
		    var templates =_.map(result.rows, function(template){
		    	var vm=getTemplateVm(template);
		      	return vm;
		  	});
		    console.log('result');
	  		console.log(templates);
		  	res.json({result:true, objects:templates});
	  	},function(){

	  	});
	};

	controller.postTemplate=function (req, res) {
		var newTemplate={
			title: req.body.title,
			templateBody: req.body.templateBody,
			templateType: req.body.templateType
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


	function getTemplateVm(template){
		return {
			_id: template._id,
			title: template.title,
			templateBody: template.templateBody,
			templateType: template.templateType
		};
	}
	
  return controller;
};
