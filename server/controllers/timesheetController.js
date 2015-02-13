'use strict';

module.exports = function(){
	var _=require('lodash'),
		timesheetservice=require('../services/timesheetservice')(),
		Q=require('q');

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
		return {
			_id: timesheet._id,
			worker: {_id: worker.id, firstName: worker.firstName, lastName: worker.lastName},
	        batch: timesheet.batch,
	        status: timesheet.status,
	        weekEndingDate: timesheet.weekEndingDate,
	        elements: timesheet.elements,
	        net: timesheet.net,
	        vat: timesheet.vat,
	        totalPreDeductions: timesheet.totalPreDeductions,
	        deductions: timesheet.deductions,
	        total: timesheet.total,
	        imageUrl: timesheet.imageUrl
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
				res.json(response);
			},function(err){
			 	res.sendFailureResponse(err);
			});
	};

	controller.postTimesheet=function (req, res) {	
		var timesheet = req.body;		
		timesheet.addedBy = req.user.id;
		timesheet.dateAdded = new Date();
		timesheet.lastEditedBy = req.user.id;
		timesheet.dateEdited = new Date();

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

	return controller;
};