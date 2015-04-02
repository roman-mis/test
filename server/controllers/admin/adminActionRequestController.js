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
			smp:{
				babyDueDate:req.body.babyDueDate
			},
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
			
			spp:{
				babyDueDate:req.body.babyDueDate,
				relationship:req.body.relationship
			},
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
			holidayPay:{
				amount:req.body.amount
			},
			createdBy:req.user.id


		};

		postActionRequest(req,res,detail,enums.actionRequestTypes.HolidayPay);

	};


	controller.postStudentLoan=function(req,res){
		var detail={
			'type':enums.actionRequestTypes.SLR,
			'status':enums.statuses.Submitted,
			worker:req.params.userId,
			studentLoan:{
				haveLoan:req.body.haveLoan,
				payDirectly:req.body.payDirectly
			},
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
    	adminActionRequestService.getActionRequestData()
    		.then(function(response){
    			console.log(response);
    			var actionrequests = getActionRequestDataVm(response);
    		res.json({objects:actionrequests});
    		})
    		.then(null,function(err){
    			res.sendFailureResponse(err);
    		});
    };



    function getActionRequestDataVm(data){
    	var actionRequest=[];
    	   	
			_.forEach(data, function(actionrequests){
				var actionRequestData = {
					id : actionrequests._id,
					user: {
						contractorId : actionrequests.worker._id,
						userId : actionrequests.createdBy,
						contractorName : actionrequests.worker.firstName + ' ' + actionrequests.worker.lastName,
						contractorNo : actionrequests.worker.candidateNo
						},
					dateRequested : actionrequests.worker.createdDate,
					status : actionrequests.status,
					type : actionrequests.type,
					periodActioned : actionrequests.periodActioned || '',
					requestRef: utils.padLeft(actionrequests.worker.candidateNo || '0', 7, '0')	
				};
				actionRequest.push(actionRequestData);
			});
		

    	
    	return actionRequest;
    }

    return controller;
};
