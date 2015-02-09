'use strict';

module.exports = function(){
	var timesheetservice=require('../services/timesheetservice')(),
		Q=require('q');

	var controller = {};

	controller.getTimesheets = function(req, res){
		return timesheetservice.getTimesheets()
	    	.then(function(result){
	      		// var vm = getTimesheetVm(result);
	      		res.json({result:true, objects:result});
    		},function(err){
		    	res.sendFailureResponse(err);
	   		});
	};

	controller.getTimesheet = function(req, res){
		return timesheetservice.getTimesheet(req.params.id)
	    	.then(function(result){
	      		res.json({result:true, object:result});
    		},function(err){
		    	res.sendFailureResponse(err);
	   		});
	};

	function getTimesheetVm(timesheet){
		return timesheet;
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
				res.json(response);
				// getExpenseVm(response, true)
		  //       .then(function(_expense){
	   //        		res.json(_expense);
		  //       },res.sendFailureResponse);
			},function(err){
			 	res.sendFailureResponse(err);
			});
	};

	return controller;
};