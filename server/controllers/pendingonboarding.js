'use strict';

module.exports = function(){
  
    var pendingonboardingservice = require('../services/pendingonboardingservice');
    var enums=require('../utils/enums');


    var controller={};


    controller.getPendingOnboardingDetails=function(req,res){
      	pendingonboardingservice.getPendingOnboardingDetails(req.params.id)
        .then(function(result){
          res.json({result:true, object:result});
        },function(){

        });
    };

    controller.patchPendingOnboardingDetails = function(req, res){
    	var pendingOnboardingDetails = {
    		user: req.params.id,
    		agency:req.body.agency,
    		agencyName: req.body.agencyName,
    		consultant: req.body.consultant,
    		payeRate: req.body.payeRate,
    		outsourcedRate: req.body.outsourcedRate,
    		serviceUsed: req.body.serviceUsed,
    		requirements: req.body.requirements
    	};

      var complete = (req.body.complete === true ? true : false);
      var historyDetails;
      if(complete){
        historyDetails = {
          eventType: enums.eventType.ONBOARDING,
          eventDate: new Date(),
          historyBy: req.user.id,
          user: req.params.id,
          eventData: pendingOnboardingDetails,
          notes: 'Onboarding added by ' + req.user.firstName + ' ' + req.user.lastName
        };
      }
      //res.json({onboarding:pendingOnboardingDetails,history:historyDetails});
      //return;
      //console.log(historyDetails);

    	pendingonboardingservice.patchPendingOnboardingDetails(req.params.id, pendingOnboardingDetails, complete, historyDetails)
        .then(function(result){
          res.json({result:true, object:result.object});
        },function(){

        });
    };

  return controller;
};
