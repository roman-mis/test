'use strict';


module.exports = function(dbs){
	var db = dbs,
	
	 
	taskservice=require('../services/taskservice')(db),
	
	 //restMiddleware=require('../middlewares/restmiddleware'),
	
	 enums=require('../utils/enums')
	;
	var controller={};
		  
		controller.getTaskDetails=function(req,res){
			// console.log('calling getTaskDetails');
		  	taskservice.getTaskDetails(req.params.id)
		    .then(function(result){
		    	// console.log('returned from promise');
		      res.json({result:true, objects:result});
		      
		    },function(err){
		    	// console.log('rejected');
		    	// console.log(err);
		    	res.sendFailureResponse(err);
		    });
			
		};

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
				eventType: enums.eventType.CREATE_TASK,
				eventDate: new Date(),
				historyBy: req.user.id,
				user: req.params.id,
				eventData: null,
				notes: 'Task added by ' + req.user.firstName + ' ' + req.user.lastName
			};
			res.json({task:taskDetails,history:historyDetails});
			return;
			console.log(taskDetails);
			console.log(historyDetails);

			taskservice.postTaskDetails(req.params.id, taskDetails, historyDetails)
		    .then(function(result){
		      res.json({result:true, object:result.object});
		    },function(){

		    });
		};

		controller.getCalllogDetails=function(req,res){
		  	taskservice.getCalllogDetails(req.params.id)
		    .then(function(result){
		      res.json({result:true, objects:result});
		    },function(){

		    });
		};

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
				taskCategory: enums.taskCategory.CALL_LOG
			};

			var historyDetails = {
				eventType: enums.eventType.CALL_LOG,
				eventDate: new Date(),
				historyBy: req.user.id,
				user: req.params.id,
				eventData: taskDetails,
				notes: 'Call log added by ' + req.user.firstName + ' ' + req.user.lastName
			};

			console.log(taskDetails);
			console.log(historyDetails);

			taskservice.postCalllogDetails(req.params.id, taskDetails, historyDetails)
		    .then(function(result){
		      res.json({result:true, object:result.object});
		    },function(){

		    });
		};
	return controller;
};
