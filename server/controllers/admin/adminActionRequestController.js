'use strict';
var controller={};
module.exports = function(dbs){
	var systemservice = require('../../services/systemservice')(dbs),
		adminActionRequestService = require('../../services/admin/adminActionRequestService')(dbs);

	controller.postSsp=function(req,res){
		var sspDetail={
			'type':'ssp',
			'status':'submitted',
			worker:req.params.id,
			dateInformed:req.body.dateInformed,
			startDate:req.body.startDate,
			endDate:req.body.endDate,
			days:req.body.days,
			imageUrl:req.body.imageUrl
		};

		adminActionRequestService.saveSsp(req.params.id,sspDetail)
			.then(function(response){
				res.json({result:response.result,object:response.object.sspModel});

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
    return controller;
};