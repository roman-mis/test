'use strict';


module.exports = function(dbs){
	var express = require('express'),
    jwt = require('jsonwebtoken'),
	db = dbs,
	router = express.Router(),
	templateservice=require('../services/templateservice'),
	utils=require('../utils/utils'),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	fs=require('fs'),
	path=require('path')
	;
	var awsservice=require('../services/awsservice');

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
	  	},function(err){

	  	});
	}

	controller.postTemplate=function (req, res) {
		var newTemplate={
			title: req.body.title,
			template_body: req.body.template_body,
			template_type: req.body.template_type
		};

		templateservice.addTemplate(newTemplate).then(function(response){
			var vm = getTemplateVm(response);
			res.json({result:true, object:vm});
		},function(err){
		 	res.sendFailureResponse(err);
		});
	}

	controller.getTemplate=function(req,res){
		templateservice.getTemplate(req.params.id)
			.then(function(template){
				var vm = getTemplateVm(template);
				res.json({result:true, object:vm});
			},res.sendFailureResponse);
	}


	function getTemplateVm(template){
		return {
			_id: template._id,
			title: template.title,
			template_body: template.template_body,
			template_type: template.template_type
		}
	}
	
  return controller;
};
