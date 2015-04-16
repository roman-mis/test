'use strict';


module.exports = function(){
	var _=require('lodash'),
		invoiceservice=require('../services/invoiceservice')();
		// Q = require('q');

	var controller={};

		controller.getAllInvoices=function (req,res){
			invoiceservice.getAllInvoices(req._restOptions)
		  	.then(function(result){

			    var invoices =_.map(result.rows, function(invoice){
			    	var vm=getInvoiceVm(invoice);
			      	return vm;
			  	});
			    res.json({result:true, objects:invoices});
		  	},function(err){
		  		res.sendFailureResponse(err);
		  	});
		};

		controller.postInvoice=function (req, res) {
			saveInvoice(req, res, 'post');
		};

		controller.receiveInvoices=function (req, res) {
			invoiceservice.receiveInvoices(req.body.reqBody)
			.then(function(result){
				console.log('***********controller**********')
				res.json(result);
			},function(err){
				res.sendFailureResponse(err);
			});
		};

		controller.patchInvoice=function (req, res) {
			saveInvoice(req, res, 'patch');
		};

		function saveInvoice(req, res, type){
			var newInvoice=req.body;

			invoiceservice.saveInvoice((type==='patch'?req.params.id:null), newInvoice).then(function(invoice){

				// buildInvoiceVm(invoice, true)
		  //       .then(function(_invoice){
	   //        		res.json({result:true, object:_invoice});
		  //       },res.sendFailureResponse);
				res.json({result:true, object:invoice});
			},function(err){

			 	res.sendFailureResponse(err);
			});
		}

		controller.getInvoice=function(req,res){
			invoiceservice.getInvoice(req.params.id, true)
				.then(function(invoice){
					var vm = getInvoiceVm(invoice);
					res.json({result:true, object:vm});
				},res.sendFailureResponse);
		};

		function getInvoiceVm(invoice){
			var agency = invoice.agency || {};
			var branch = invoice.branch || {};
			return {
				_id: invoice._id,
				agency: {_id: agency._id, name: agency.name},
				branch: {_id: branch._id, name: branch.name},
				timesheetBatch: invoice.timesheetBatch,
				date: invoice.date,
				invoiceNumber: invoice.invoiceNumber,
				dueDate: invoice.dueDate,
				lines: invoice.lines,
				companyDefaults: invoice.companyDefaults,
				net: invoice.net,
				vatRate: invoice.vatRate,
				vat: invoice.vat,
				total: invoice.total,
				status:invoice.status
			};
		}

		// function buildInvoiceVm(invoice, reload){
		// 	return Q.Promise(function(resolve, reject){
		// 		if(reload){
		// 			return invoiceservice.getInvoice(invoice._id, true)
		//       		.then(function(invoice){
		//       			var invoiceVm = getInvoiceVm(invoice);
		//       			resolve({result:true, object: invoiceVm});
		//       		},reject);
		// 		}else{
		// 			getInvoiceVm(invoice);
		// 		}
		// 	});
		// }

 return controller;
};

