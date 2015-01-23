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
				task_type: req.body.task_type,
				status: req.body.status,
				template_html: req.body.template_html,
				template: req.body.template,
				template_title: req.body.template_title,
				follow_up_task_date: req.body.follow_up_task_date,
				notify_me: req.body.notify_me,
				completed_date: null,
				task_category: enums.task_category.TASK
			};

			var historyDetails = {
				event_type: enums.event_type.CREATE_TASK,
				event_date: new Date(),
				history_by: req.user.id,
				user: req.params.id,
				event_data: null,
				notes: 'DPA updated by ' + req.user.first_name + ' ' + req.user.last_name
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
				task_type: req.body.task_type,
				status: req.body.status,
				template_html: req.body.template_html,
				template: req.body.template,
				template_title: req.body.template_title,
				follow_up_task_date: req.body.follow_up_task_date,
				notify_me: req.body.notify_me,
				completed_date: null,
				task_category: enums.task_category.CALL_LOG
			};

			var historyDetails = {
				event_type: enums.event_type.CREATE_TASK,
				event_date: new Date(),
				history_by: req.user.id,
				user: req.params.id,
				event_data: null,
				notes: 'DPA updated by ' + req.user.first_name + ' ' + req.user.last_name
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
