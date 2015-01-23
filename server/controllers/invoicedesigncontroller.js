'use strict';


module.exports = function(dbs){
	var express = require('express'),
    jwt = require('jsonwebtoken'),
	db = dbs,
	router = express.Router(),
	invoicedesignservice=require('../services/invoicedesignservice'),
	utils=require('../utils/utils'),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	fs=require('fs'),
	path=require('path')
	;
	var awsservice=require('../services/awsservice');

	var controller={};
		 
		controller.getAllInvoiceDesigns=function (req,res){

			invoicedesignservice.getAllInvoiceDesigns(req._restOptions)
		  	.then(function(result){
		  		
			    var invoicedesigns =_.map(result.rows, function(invoicedesign){
			    	var vm=getInvoiceDesignVm(invoicedesign);
			      	return vm;
			  	});
			    res.json({result:true, objects:invoicedesigns});
		  	},function(err){

		  	});
		}

		controller.postInvoiceDesign=function (req, res) {
			saveInoviceDesign(req, res, 'post');
		}

		controller.patchInvoiceDesign=function (req, res) {
			saveInoviceDesign(req, res, 'patch');
		}

		function saveInoviceDesign(req, res, type){
			var newInvoiceDesign={
				name: req.body.name,
				content: req.body.content,
			};

			invoicedesignservice.saveInvoiceDesign((type=='patch'?req.params.id:null), newInvoiceDesign).then(function(response){
				var vm = getInvoiceDesignVm(response);
				res.json({result:true, object:vm});
			},function(err){
			 	res.sendFailureResponse(err);
			});
		}

		controller.getInvoiceDesign=function(req,res){
			invoicedesignservice.getInvoiceDesign(req.params.id)
				.then(function(invoicedesign){
					var vm = getInvoiceDesignVm(invoicedesign);
					res.json({result:true, object:vm});
				},res.sendFailureResponse);
		}

		function getInvoiceDesignVm(invoicedesign){
			return {
				_id: invoicedesign._id,
				name: invoicedesign.name,
				content: invoicedesign.content,
			}
		}
 return controller;
};

