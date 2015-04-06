'use strict';
var controller={};
module.exports = function(dbs){
	var utils=require('../../utils/utils');
	var _ =require('lodash');
	var systemservice = require('../../services/systemservice')(dbs);
	var adminActionRequestService = require('../../services/admin/adminActionRequestService')(dbs);
	var enums=require('../../utils/enums');
	var Q=require('q');
	controller.postSsp=function(req,res){

		var detail={
			'type':enums.actionRequestTypes.SSP,
			'status':enums.statuses.Submitted,
			worker:req.params.userId,
			dateInformed:req.body.dateInformed,
			startDate:req.body.startDate,
			endDate:req.body.endDate,
			days:req.body.days,
			imageUrl:req.body.imageUrl,
			createdBy:req.user.id
		};

		// _.forEach(detail.days,function(detailDay){
		// 	// detailDay.sick=true;
		// });


		postActionRequest(req,res,detail,enums.actionRequestTypes.SSP);
	};

	controller.postSmp=function(req,res){
		var detail={
			'type':enums.actionRequestTypes.SMP,
			'status':enums.statuses.Submitted,
			worker:req.params.userId,
			startDate:req.body.startDate,
			intendedStartDate:req.body.intendedStartDate,
			smp:req.body.smp,
			days:req.body.days,
			imageUrl:req.body.imageUrl,
			createdBy:req.user.id

		};

		postActionRequest(req,res,detail,enums.actionRequestTypes.SMP);

	};

	controller.postSpp=function(req,res){
		var detail={
			'type':enums.actionRequestTypes.SPP,
			'status':enums.statuses.Submitted,
			worker:req.params.userId,
			spp:req.body.spp,
			days:req.body.days,
			imageUrl:req.body.imageUrl,
			createdBy:req.user.id

		};

		postActionRequest(req,res,detail,enums.actionRequestTypes.SPP);

	};

	controller.postHolidayPay=function(req,res){
		var detail={
			'type':enums.actionRequestTypes.HolidayPay,
			'status':enums.statuses.Submitted,
			worker:req.params.userId,
			holidayPay:req.body.holidayPay,
			createdBy:req.user.id


		};

		postActionRequest(req,res,detail,enums.actionRequestTypes.HolidayPay);

	};


	controller.postStudentLoan=function(req,res){
		var detail={
			'type':enums.actionRequestTypes.SLR,
			'status':enums.statuses.Submitted,
			worker:req.params.userId,
			studentLoan:req.body.studentLoan,
			createdBy:req.user.id


		};

		postActionRequest(req,res,detail,enums.actionRequestTypes.SLR);

	};

	function postActionRequest(req,res,detail,actionRequestType){
		console.log('detail');
		console.log(detail);
		return Q.Promise(function(resolve,reject){
			adminActionRequestService.saveActionRequest(req.params.userId,detail)
			.then(function(response){
				res.json({result:response.result,object:response.object.actionRequestModel});
				resolve(response);
			})
			.fail(function(err){
				res.sendFailureResponse(err);
				reject(err);
			});
		});
	};



    controller.checkSspQualification=function(req,res){
    	var request={
    		dateInformed:req.query.dateInformed,
    		startDate:req.query.startDate,
    		endDate:req.query.endDate,
    		maxPeriods:req.query.maxPeriods
    	};
    	adminActionRequestService.getActionRequestPayments(req.params.userId,request,'ssp')
    		.then(function(response){
                console.log(response);
    			res.json(response);
    		})
    		.then(null,function(err){
    			console.log('err');
    			console.log(err);
    			res.sendFailureResponse(err);
    		});
    };

    controller.checkSmpQualification=function(req,res){
    	var request={
    		intendedStartDate:req.query.intendedStartDate,
    		startDate:req.query.startDate,
    		babyDueDate:req.query.babyDueDate,
    		maxPeriods:req.query.maxPeriods

    	};
    	// request.endDate=moments(request.startDate).add()
    	adminActionRequestService.getActionRequestPayments(req.params.userId,request,'smp')
    		.then(function(response){
    			res.json(response);
    		})
    		.then(null,function(err){
    			console.log('err');
    			console.log(err);
    			res.sendFailureResponse(err);
    		});
    };


    controller.checkSppQualification=function(req,res){

    	var request={
    		intendedStartDate:req.query.intendedStartDate,
    		startDate:req.query.startDate,
    		babyDueDate:req.query.babyDueDate,
    		maxPeriods:req.query.maxPeriods

    	};
    	// request.endDate=moments(request.startDate).add()
    	adminActionRequestService.getActionRequestPayments(req.params.userId,request,'spp')
    		.then(function(response){
    			res.json(response);
    		})
    		.then(null,function(err){
    			console.log('err');
    			console.log(err);
    			res.sendFailureResponse(err);
    		});
    };


    controller.getActionRequestData = function(req, res){
    	adminActionRequestService.getActionRequestData(req._restOptions)
    		.then(function(response){
    			console.log(response);
	    			
	    		var actionrequests = getActionRequestDataVm(response.rows);
	            var pagination = req._restOptions.pagination || {};
	            var resp = { result: true, objects: actionrequests, meta: { limit: pagination.limit, offset: pagination.offset, totalCount: response.count } };
	            //console.log('about to send the message to client');

	            res.json(resp);

    		})
    		.then(null,function(err){
    			res.sendFailureResponse(err);
    		});
    };



controller.getActionRequestDataById =function(req, res){
	adminActionRequestService.getActionRequestDataById(req.params.id)
    		.then(function(response){
    		if(response){
    			var actionrequests = getActionRequestDataByIdVm(response);
    			res.json({result:true,object: actionrequests});
    		}else{
    			res.json({result:false, message : 'actionRequestData not found.'});
    		}
    		})
    		.then(null,function(err){
    			res.sendFailureResponse(err);
    		});
};


 function getActionRequestDataByIdVm(data){

 	var createdBy = data.createdBy || {};
 	return {
 		id: data._id,
 		worker : {
 			id : data.worker._id,
 			name : data.worker.firstName + ' ' + data.worker.lastName,
 			candidateRef : utils.padLeft(data.worker.candidateNo || '0', 7, '0')
 		},
 		dateRequested : data.worker.createdDate,
		status : data.status,
		type : data.type,
		periodActioned : '',
		requestRef: utils.padLeft(data.requestReference || '0', 7, '0'),
		createdBy : {
			id : createdBy._id,
			name : (createdBy.firstName || '') + ' ' + (createdBy.lastName || '')
		},
		dateInformed : data.dateInformed,
		intendedStartDate : data.intendedStartDate,
		actualStartDate : data.actualStartDate,
		startDate : data.startDate,
		endDate : data.endDate,
		smp : data.smp,
		spp : data.spp,
		holidayPay : data.holidayPay,
		studentLoan : data.studentLoan,
		imageUrl : data.imageUrl,
		days : data.days
 	 }
 	}


    function getActionRequestDataVm(data){
    	var actionRequest=[];

			_.forEach(data, function(actionrequests){
				var createdBy=actionrequests.createdBy||{};
				var actionRequestData = {
					id : actionrequests._id,
					worker: actionrequests.worker ? {
						id : actionrequests.worker._id,
						name : actionrequests.worker.firstName + ' ' + actionrequests.worker.lastName,
						candidateNo : utils.padLeft(actionrequests.worker.candidateNo || '0', 7, '0')
						}:{},
					dateRequested : actionrequests.worker?actionrequests.worker.createdDate:null,
					status : actionrequests.status,
					type : actionrequests.type,

					periodActioned : '',
					requestRef: utils.padLeft(actionrequests.requestReference || '0', 7, '0'),
					createdBy : {
						id : createdBy._id,
						name :(createdBy.firstName||'') + ' ' + (createdBy.lastName || '')
					},
					dateInformed : actionrequests.dateInformed,
					intendedStartDate : actionrequests.intendedStartDate,
					actualStartDate : actionrequests.actualStartDate,
					startDate : actionrequests.startDate,
					endDate : actionrequests.endDate
				/*	smp : actionrequests.smp,
					spp : actionrequests.spp,
					holidayPay : actionrequests.holidayPay,
					studentLoan : actionrequests.studentLoan,
					imageUrl : actionrequests.imageUrl,
					days : actionrequests.days	 */
				};
				actionRequest.push(actionRequestData);
			});

    	return actionRequest;
    }

    controller.updateActionRequest = function(req, res){


		var details = {
			dateInformed : req.body.dateInformed,
			startDate : req.body.startDate,
			endDate : req.body.endDate,
			intendedStartDate : req.body.intendedStartDate,
			actualStartDate  : req.body.actualStartDate,
			// requestRef : req.body.requestRef,
			smp :req.body.smp,
			spp : req.body.spp,
			holidayPay : req.body.holidayPay,
			studentLoan : req.body.studentLoan,
			imageUrl : req.body.imageUrl,
			days : req.body.days,
			updatedDate : Date(),
			updatedBy : req.user._id
		};

		adminActionRequestService.updateActionRequest(req.params.id, details,req.params.status)

			.then(function(response){
				console.log('response received ');
				console.log(response);
				var updatedActionRequestData = getUpdatedActionRequestDataVm(response);
				res.json({object : updatedActionRequestData});
			}).then(null,function(err){
    			res.sendFailureResponse(err);
    		})

	};


	function getUpdatedActionRequestDataVm(data){

		return{
		id: data.object._id,
 		worker : {
 			id : data.object.worker._id,
 			name : data.object.worker.firstName + ' ' + data.object.worker.lastName,
 			candidateRef : utils.padLeft(data.object.worker.candidateNo || '0', 7, '0')
 		}, 
 		dateRequested : data.object.worker.createdDate,
		status : data.object.status,
		type : data.object.type,
		periodActioned : '',
		requestRef: utils.padLeft(data.object.requestReference || '0', 7, '0'),
		createdBy : {
			id : data.object.createdBy._id,
			name : (data.object.createdBy.firstName) + ' ' + (data.object.createdBy.lastName)
		},
		dateInformed : data.object.dateInformed,
		intendedStartDate : data.object.intendedStartDate,
		actualStartDate : data.object.actualStartDate,
		startDate : data.object.startDate,
		endDate : data.object.endDate,
		smp : data.object.smp,
		spp : data.object.spp,
		holidayPay : data.object.holidayPay,
		studentLoan : data.object.studentLoan,
		imageUrl : data.object.imageUrl,
		days : data.object.days,
		updatedDate : data.object.updatedDate,
		updatedBy : data.object.updatedBy  
		}
	}


    return controller;
};
