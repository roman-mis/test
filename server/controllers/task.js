'use strict';


module.exports = function(dbs){
	var express = require('express'),
    jwt = require('jsonwebtoken'),
	db = dbs,
	router = express.Router(),
	taskservice=require('../services/taskservice'),
	utils=require('../utils/utils'),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	fs=require('fs'),
	path=require('path'),
	enums=require('../utils/enums')
	;
	var awsservice=require('../services/awsservice');

	var controller={};
		  
		controller.getTaskDetails=function(req,res){
		  	taskservice.getTaskDetails(req.params.id)
		    .then(function(result){
		      res.json({result:true, objects:result});
		    },function(){

		    });
		}

		controller.postTaskDetails = function(req, res){
			var taskDetails = {
				user: req.params.id,
				assignee:req.body.assignee,
				owner:req.user.id,
				agency:req.body.agency,
				priority: req.body.priority,
				taskType: req.body.taskType,
				status: req.body.status,
				templateHtml: req.body.templateHtml,
				template: req.body.template,
				templateTitle: req.body.templateTitle,
				followUpTaskDate: req.body.followUpTaskDate,
				notifyMe: req.body.notifyMe,
				completedDate: null,
				taskCategory: enums.taskCategory.TASK
			};

			var historyDetails = {
				eventType: enums.eventType.CREATETASK,
				eventDate: new Date(),
				historyBy: req.user.id,
				user: req.params.id,
				eventData: null,
				notes: 'DPA updated by ' + req.user.firstName + ' ' + req.user.lastName
			};

			console.log(taskDetails);
			console.log(historyDetails);

			taskservice.postTaskDetails(req.params.id, taskDetails, historyDetails)
		    .then(function(result){
		      res.json({result:true, object:result.object});
		    },function(){

		    });
		}

		controller.getCalllogDetails=function(req,res){
		  	taskservice.getCalllogDetails(req.params.id)
		    .then(function(result){
		      res.json({result:true, objects:result});
		    },function(){

		    });
		}

		controller.postCalllogDetails = function(req, res){
			var taskDetails = {
				user: req.params.id,
				assignee:req.body.assignee,
				owner:req.user.id,
				agency:req.body.agency,
				priority: req.body.priority,
				taskType: req.body.taskType,
				status: req.body.status,
				templateHtml: req.body.templateHtml,
				template: req.body.template,
				templateTitle: req.body.templateTitle,
				followUpTaskDate: req.body.followUpTaskDate,
				notifyMe: req.body.notifyMe,
				completedDate: null,
				taskCategory: enums.taskCategory.CALLLOG
			};

			var historyDetails = {
				eventType: enums.eventType.CREATETASK,
				eventDate: new Date(),
				historyBy: req.user.id,
				user: req.params.id,
				eventData: null,
				notes: 'DPA updated by ' + req.user.firstName + ' ' + req.user.lastName
			};

			console.log(taskDetails);
			console.log(historyDetails);

			taskservice.postCalllogDetails(req.params.id, taskDetails, historyDetails)
		    .then(function(result){
		      res.json({result:true, object:result.object});
		    },function(){

		    });
		}
	return controller;
};
