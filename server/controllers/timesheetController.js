'use strict';

module.exports = function(dbs){
	var _=require('lodash'),
		timesheetservice=require('../services/timesheetservice')(dbs),
		systemservice = require('../services/systemservice')(dbs),
		Q=require('q'),
		utils=require('../utils/utils');

	var controller = {};

	controller.getTimesheets = function(req, res){
		return timesheetservice.getTimesheets(req._restOptions)
	    	.then(function(timesheets){
	      		var timesheetVms = [];
	      		_.forEach(timesheets.rows, function(_timesheet){
			  		var timesheet = getTimesheetVm(_timesheet);
			  		timesheetVms.push(timesheet);
				});
	      		
			    var pagination=req._restOptions.pagination||{};
		    	var resp={result:true,objects:timesheetVms, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:timesheets.count}};
				
				res.json(resp);
    		},function(err){
		    	res.sendFailureResponse(err);
	   		});
	};

	controller.getTimesheet = function(req, res){
		return timesheetservice.getTimesheet(req.params.id, true)
	    	.then(function(result){
	      		var timesheet = getTimesheetVm(result);
	      		res.json({result:true, object:timesheet});
    		},function(err){
		    	res.sendFailureResponse(err);
	   		});
	};

	function getTimesheetVm(timesheet){
		var worker = timesheet.worker || {};
		var batch = timesheet.batch || {};
		return {
			_id: timesheet._id,
			agency: batch.agency,
			branch: batch.branch,
			worker: {_id: worker.id, firstName: worker.firstName, lastName: worker.lastName},
	        batch: timesheet.batch,
	        status: timesheet.status,
	        payFrequency: timesheet.payFrequency,
	        weekEndingDate: timesheet.weekEndingDate,
	        elements: timesheet.elements,
	        net: timesheet.net,
	        vat: timesheet.vat,
	        totalPreDeductions: timesheet.totalPreDeductions,
	        deductions: timesheet.deductions,
	        total: timesheet.total,
	        imageUrl: timesheet.imageUrl,
	        payrollSettings: timesheet.payrollSettings
		};
	}

	function buildTimesheetVm(timesheet, reload){
		return Q.Promise(function(resolve, reject){
			if(reload){
				return timesheetservice.getTimesheet(timesheet._id, true)
	      		.then(function(response){
	      			var timesheetVm = getTimesheetVm(response);
	      			resolve({result:true, object: timesheetVm});
	      		},reject);
			}else{
				getTimesheetVm(timesheet);
			}
		});
	}

	controller.patchTimesheet=function (req, res) {
		var timesheet = req.body;
		timesheet.lastEditedBy = req.user.id;
		timesheet.dateEdited = new Date();

		timesheetservice.saveTimesheet(req.params.id, timesheet)
			.then(function(response){
				buildTimesheetVm(response, true)
		        .then(function(_timesheet){
	          		res.json(_timesheet);
		        },res.sendFailureResponse);
			},function(err){
			 	res.sendFailureResponse(err);
			});
	};

	controller.postTimesheet = function (req, res) {	
		var timesheet = req.body;		
		timesheet.addedBy = req.user.id;
		timesheet.dateAdded = new Date();
		timesheet.lastEditedBy = req.user.id;
		timesheet.dateEdited = new Date();
		console.log(timesheet);
		timesheetservice.saveTimesheet(null, timesheet)
			.then(function(response){
				buildTimesheetVm(response, true)
		        .then(function(_timesheet){
	          		res.json(_timesheet);
		        },res.sendFailureResponse);
			},function(err){
			 	res.sendFailureResponse(err);
			});
	};

	controller.uploadTimesheet = function(req, res){
		var uploadedFile = req.files.file;
		if(uploadedFile){
			utils.readCsvFromFile(uploadedFile.path).then(function(data){
				systemservice.getSystem()
			  	.then(function(system){
			  		var paymentRates = system.paymentRates;
			  		if(Object.keys(data[0]).length === 15){
			  			// Format 1 : Column Count = 15
				  		console.log('Format 1');
				  		_.forEach(data, function(row){
				  			if(row.rateDescription){
				  				var paymentRate = findPaymentRate(paymentRates, row.rateDescription);
				  				row.elementType = paymentRate._id || null;
				  				row.paymentRate = paymentRate;
				  			}
				  			row.units = row.noOfUnits;
				  			row.payRate = row.unitRate;
	                		row.chargeRate = row.unitRate;
						});
						res.json({result:true, objects: data});
			  		}else{
						res.json({result:false, message:'Invalid CSV File.'});
			  		}
			  	})
			  	.fail(res.sendFailureResponse);
			});
		}else{
			res.json({result:false, message:'No File Attached.'});
		}
		

		function findPaymentRate(paymentRates, search){
			var paymentRate = {};
			_.forEach(paymentRates, function(_paymentRate){
				if(_paymentRate.name.toString().trim().toLowerCase() === search.trim().toLowerCase() || (_paymentRate.importAliases.indexOf(search) > 0)){
					paymentRate = _paymentRate;
					return false;
				}
			});
			return paymentRate;
		}
	};

	return controller;
};