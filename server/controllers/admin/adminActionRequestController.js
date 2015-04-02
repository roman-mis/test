'use strict';
var controller={};
module.exports = function(dbs){
	var utils=require('../../utils/utils');
	var _ =require('lodash');
	var systemservice = require('../../services/systemservice')(dbs);
	var adminActionRequestService = require('../../services/admin/adminActionRequestService')(dbs);
	var enums=require('../../utils/enums');
	controller.postSsp=function(req,res){

		var sspDetail={
			'type':enums.actionRequestTypes.SSP,
			'status':enums.statuses.Submitted,
			worker:req.params.id,
			dateInformed:req.body.dateInformed,
			startDate:req.body.startDate,
			endDate:req.body.endDate,
			days:req.body.days,
			imageUrl:req.body.imageUrl,
			createdBy:req.user.id
		};

		_.forEach(sspDetail.days,function(detailDay){
			detailDay.sick=true;
		});

		adminActionRequestService.saveActionRequest(req.params.id,sspDetail)
			.then(function(response){
				res.json({result:response.result,object:response.object.actionRequestModel});

			})
			.fail(res.sendFailureResponse);
	};

	controller.postSmp=function(req,res){
		var detail={
			'type':enums.actionRequestTypes.SMP,
			'status':enums.statuses.Submitted,
			worker:req.params.id,
			startDate:req.body.startDate,
			intendedStartDate:req.body.intendedStartDate,
			smp:{
				babyDueDate:req.body.babyDueDate
			},
			days:req.body.days,
			imageUrl:req.body.imageUrl,
			createdBy:req.user.id

		};

		adminActionRequestService.saveActionRequest(req.params.id,detail)
			.then(function(response){
				res.json({result:response.result,object:response.object.actionRequestModel});

			})
			.fail(res.sendFailureResponse);

	};

	controller.postSpp=function(req,res){
		var detail={
			'type':enums.actionRequestTypes.SPP,
			'status':enums.statuses.Submitted,
			worker:req.params.id,
			
			spp:{
				babyDueDate:req.body.babyDueDate,
				relationship:req.body.relationship
			},
			days:req.body.days,
			imageUrl:req.body.imageUrl,
			createdBy:req.user.id

		};

		adminActionRequestService.saveActionRequest(req.params.id,detail)
			.then(function(response){
				res.json({result:response.result,object:response.object.actionRequestModel});

			})
			.fail(res.sendFailureResponse);

	};

	controller.postHolidayPay=function(req,res){
		var detail={
			'type':enums.actionRequestTypes.HolidayPay,
			'status':enums.statuses.Submitted,
			worker:req.params.id,
			holidayPay:{
				amount:req.body.amount
			},
			createdBy:req.user.id


		};
		console.log('detail');
		console.log(detail);

		adminActionRequestService.saveActionRequest(req.params.id,detail)
			.then(function(response){
				res.json({result:response.result,object:response.object.actionRequestModel});

			})
			.fail(res.sendFailureResponse);

	};


	controller.postStudentLoan=function(req,res){
		var detail={
			'type':enums.actionRequestTypes.SLR,
			'status':enums.statuses.Submitted,
			worker:req.params.id,
			studentLoan:{
				haveLoan:req.body.haveLoan,
				payDirectly:req.body.payDirectly
			},
			createdBy:req.user.id


		};

		adminActionRequestService.saveActionRequest(req.params.id,detail)
			.then(function(response){
				res.json({result:response.result,object:response.object.actionRequestModel});

			})
			.fail(res.sendFailureResponse);

	};

	

    controller.checkSspQualification=function(req,res){
    	var request={
    		dateInformed:req.query.dateInformed,
    		startDate:req.query.startDate,
    		endDate:req.query.endDate,
    		maxPeriods:req.query.maxPeriods
    	};
    	adminActionRequestService.getActionRequestPayments(req.params.id,request,'ssp')
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
    	adminActionRequestService.getActionRequestPayments(req.params.id,request,'smp')
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
    	adminActionRequestService.getActionRequestPayments(req.params.id,request,'spp')
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
						id : actionrequests.worker._id,
						contractorName : actionrequests.worker.firstName + ' ' + actionrequests.worker.lastName,
						},
					dateRequested : actionrequests.worker.createdDate,
					status : actionrequests.status,
					type : actionrequests.type,
					requestRef: utils.padLeft(actionrequests.worker.candidateNo || '0', 7, '0')	
				};
				actionRequest.push(actionRequestData);
			});
		

    	
    	return actionRequest;
    }

    return controller;
};
