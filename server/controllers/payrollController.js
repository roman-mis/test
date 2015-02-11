'use strict';


module.exports = function(){
	var _=require('lodash');
	var payrollservice=require('../services/payrollservice')();

	var controller={};
		 
		controller.getAllPayrolls=function (req,res){
			payrollservice.getAllPayrolls(req._restOptions)
		  	.then(function(result){
		  		
			    var payrolls =_.map(result.rows, function(payroll){
			    	var vm=getPayrollVm(payroll);
			      	return vm;
			  	});
			    res.json({result:true, objects:payrolls});
		  	},function(err){
		  		res.sendFailureResponse(err);
		  	});
		};

		controller.postPayroll=function (req, res) {
			savePayroll(req, res, 'post');
		};

		controller.patchPayroll=function (req, res) {
			savePayroll(req, res, 'patch');
		};

		function savePayroll(req, res, type){
			var newPayroll=req.body;

			payrollservice.savePayroll((type==='patch'?req.params.id:null), newPayroll).then(function(response){
				var vm = getPayrollVm(response);
				res.json({result:true, object:vm});
			},function(err){
			 	res.sendFailureResponse(err);
			});
		}

		controller.getPayroll=function(req,res){
			payrollservice.getPayroll(req.params.id)
				.then(function(payroll){
					var vm = getPayrollVm(payroll);
					res.json({result:true, object:vm});
				},res.sendFailureResponse);
		};

		function getPayrollVm(payroll){
			return {
				_id: payroll._id,
				name: payroll.name,
				content: payroll.content,
			};
		}
 return controller;
};

