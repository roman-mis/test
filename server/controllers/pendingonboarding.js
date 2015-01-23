'use strict';

module.exports = function(dbs){
  
    var express = require('express'),
        router = express.Router(),
        jwt = require('jsonwebtoken'),
    db = dbs,
    router = express.Router(),
    utils=require('../utils/utils'),
    expressJwt = require('express-jwt'),
    restMiddleware=require('../middlewares/restmiddleware'),
    fs=require('fs'),
    path=require('path'),
    pendingonboardingservice = require('../services/pendingonboardingservice');
    var awsservice=require('../services/awsservice');
    var enums=require('../utils/enums');


    var controller={};


    controller.getPendingOnboardingDetails=function(req,res){
      	pendingonboardingservice.getPendingOnboardingDetails(req.params.id)
        .then(function(result){
          res.json({result:true, object:result});
        },function(){

        });
    }

    controller.patchPendingOnboardingDetails = function(req, res){
    	var pendingOnboardingDetails = {
    		user: req.params.id,
    		agency:req.body.agency,
    		agency_name: req.body.agency_name,
    		consultant: req.body.consultant,
    		paye_rate: req.body.paye_rate,
    		outsourced_rate: req.body.outsourced_rate,
    		service_used: req.body.service_used,
    		requirements: req.body.requirements
    	};

      var complete = (req.body.complete == true ? true : false);
      var historyDetails;
      if(complete){
        historyDetails = {
          event_type: enums.event_type.ONBOARDING,
          event_date: new Date(),
          history_by: req.user.id,
          user: req.params.id,
          event_data: pendingOnboardingDetails,
          notes: 'DPA updated by ' + req.user.first_name + ' ' + req.user.last_name
        };
      }

      //console.log(historyDetails);

    	pendingonboardingservice.patchPendingOnboardingDetails(req.params.id, pendingOnboardingDetails, complete, historyDetails)
        .then(function(result){
          res.json({result:true, object:result.object});
        },function(){

        });
    }

  return controller;
};
