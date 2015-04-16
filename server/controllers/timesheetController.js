'use strict';

module.exports = function(dbs){
	var _=require('lodash'),
		timesheetservice=require('../services/timesheetservice')(dbs),
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

	controller.getTimesheetsByCandidateId = function(req, res){
		return timesheetservice.getTimesheetsByCandidateId(JSON.parse(req.params.ids).value)
	    	.then(function(timesheets){
	      		var resp={result:true,objects:timesheets};
				
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
		timesheet.createdBy = req.user.id;
		timesheet.createdDate = new Date();
		timesheet.updatedBy = req.user.id;
		timesheet.updatedDate = new Date();
		
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

	controller.uploadCsv = function(req, res){
		var timesheetTemplate = req.body.timesheettemplate;
		var uploadedFile = req.files.file;
		return timesheetservice.getCSVFile(timesheetTemplate, uploadedFile).then(function(result){
			res.json({result:true, url: result.url, objects: result.data});
		});
	};

	controller.postBulkTimesheet = function(req, res){
		var timesheetData = req.body;
		timesheetData.addedBy = req.user.id;

		timesheetservice.saveBulkTimesheet(timesheetData)
			.then(function(response){
				res.json({result:true, objects:response});
			},function(err){
			 	res.sendFailureResponse(err);
			});
	};

	controller.updateTimesheets = function(req, res){
		console.log('******************************%%%%%%%%%%%%%%%%%%5***********************')
		console.log(req.body.reqBody);
		console.log('**')
		timesheetservice.updateTimesheets(req.body.reqBody)
			.then(function(){
				res.json({result:true});
			},function(err){
			 	res.sendFailureResponse(err);
			});
	};

	controller.getTimesheetsWithAgency = function(req,res){
		return timesheetservice.getTimesheetsWithAgency()
	    	.then(function(result){
	    		// console.log(result)
	    		var temp;
	    		var timesheets = [];
	    		result.forEach(function(timesheet){
	    			temp = filter(timesheet);
	    			// console.log(temp)

	    			if(temp){
	    				timesheets.push(temp);
	    			}
	    		});
	      		res.json({result:true, object:timesheets});
    		},function(err){
    			console.log(123)
		    	res.sendFailureResponse(err);
	   		});
	};

	function filter(input){
		var output;
		if(input.agency){
			output = {};
			output.agency = input.agency;
			output.id = input._id;
			output.total = input.total;
		}

		return output;
	}

	return controller;
};