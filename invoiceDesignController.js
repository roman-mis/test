'use strict';


module.exports = function(){
	var _=require('lodash');
	var invoicedesignservice=require('../services/invoicedesignservice');

	var controller={};
		 
		controller.getAllInvoiceDesigns=function (req,res){

			invoicedesignservice.getAllInvoiceDesigns(req._restOptions)
		  	.then(function(result){
		  		
			    var invoiceDesigns =_.map(result.rows, function(invoiceDesign){
			    	var vm=getInvoiceDesignVm(invoiceDesign);
			      	return vm;
			  	});
			    res.json({result:true, objects:invoiceDesigns});
		  	},function(){

		  	});
		};

		controller.postInvoiceDesign=function (req, res) {
			saveInoviceDesign(req, res, 'post');
		};

		controller.patchInvoiceDesign=function (req, res) {
			saveInoviceDesign(req, res, 'patch');
		};

		function saveInoviceDesign(req, res, type){
			var newInvoiceDesign={
				name: req.body.name,
				content: req.body.content,
			};

			invoicedesignservice.saveInvoiceDesign((type==='patch'?req.params.id:null), newInvoiceDesign).then(function(response){
				var vm = getInvoiceDesignVm(response);
				res.json({result:true, object:vm});
			},function(err){
			 	res.sendFailureResponse(err);
			});
		}

		controller.getInvoiceDesign=function(req,res){
			invoicedesignservice.getInvoiceDesign(req.params.id)
				.then(function(invoiceDesign){
					var vm = getInvoiceDesignVm(invoiceDesign);
					res.json({result:true, object:vm});
				},res.sendFailureResponse);
		};

		function getInvoiceDesignVm(invoiceDesign){
			return {
				_id: invoiceDesign._id,
				name: invoiceDesign.name,
				content: invoiceDesign.content,
			};
		}
 return controller;
};

