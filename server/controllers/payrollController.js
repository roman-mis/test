'use strict';


module.exports = function(db){
	var _=require('lodash'),
		payrollService=require('../services/payrollservice')(db),
		Q = require('q');

	var controller={};
		 
		controller.getAllPayrolls=function (req,res){
			payrollService.getAllPayrolls(req._restOptions)
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

			payrollService.savePayroll((type==='patch'?req.params.id:null), newPayroll).then(function(payroll){
				buildPayrollVm(payroll, true)
		        .then(function(_payroll){
	          		res.json({result:true, object:_payroll});
		        },res.sendFailureResponse);
			},function(err){
			 	res.sendFailureResponse(err);
			});
		}

		controller.getPayroll=function(req,res){
			payrollService.getPayroll(req.params.id, true)
				.then(function(payroll){
					var vm = getPayrollVm(payroll);
					res.json({result:true, object:vm});
				},res.sendFailureResponse);
		};
    
        controller.runPayroll=function(req,res) {
        	var payrollRequest=req.body;
            payrollService.runPayroll(payrollRequest)
                .then(function(result){
                    res.json(result);
                },res.sendFailureResponse);
        };

		function getPayrollVm(payroll){
			var agenciesVm = [];
			if(payroll.agencies){
				_.forEach(payroll.agencies, function(_agency){
					var agency = null;
					if(_agency.agency){
						agency = {_id:_agency.agency._id, name:_agency.agency.name, };
					}
					var agencyVm ={
						agency: agency,
		                scheduleReceived: _agency.scheduleReceived,
		                timesheetsUploaded: _agency.timesheetsUploaded,
		                expensesUploaded: _agency.expensesUploaded,
		                marginUploaded: _agency.marginUploaded,
		                validationCreated: _agency.validationCreated,
		                validationSent: _agency.validationSent,
		                validationReceived: _agency.validationReceived,
		                invoiceRaised: _agency.invoiceRaised,
		                invoiceSent: _agency.invoiceSent,
		                moneyReceived: _agency.moneyReceived,
		                payrollRun: _agency.payrollRun,
		                bacsUploaded: _agency.bacsUploaded,
		                paymentConfirmed: _agency.paymentConfirmed,
		                reportsCreated: _agency.reportsCreated
					};
					agenciesVm.push(agencyVm);
				});
			}

			return {
				_id: payroll._id,
				weekNumber: payroll.weekNumber,
		        monthNumber: payroll.monthNumber,
		        periodType: payroll.periodType,
		        createdDate: payroll.createdDate,
		        createdBy: payroll.createdBy,
		        stats: payroll.stats,
		        agencies: agenciesVm
			};
		}

		function buildPayrollVm(payroll, reload){
			return Q.Promise(function(resolve, reject){
				if(reload){
					return payrollService.getPayroll(payroll._id, true)
		      		.then(function(payroll){
		      			var payrollVm = getPayrollVm(payroll);
		      			resolve({result:true, object: payrollVm});
		      		},reject);
				}else{
					getPayrollVm(payroll);
				}
			});
		}
    
 return controller;
};

