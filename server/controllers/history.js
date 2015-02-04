'use strict';

module.exports = function(){
  
    var historyservice = require('../services/historyservice');
    var enums=require('../utils/enums');

    var controller={};


    controller.patchDpa=function(req,res){
      var dpaDetails = {
        eventType: enums.eventType.DPANOTE,
        eventDate: new Date(),
        historyBy: req.user._id,
        user: req.params.id,
        eventData: null,
        notes: 'DPA updated by ' + req.user.firstName + ' ' + req.user.lastName
      };

      historyservice.saveDpa(req.params.id, dpaDetails).then(function(){
        res.json({result:true});
        },function(err){
         res.sendFailureResponse(err);
      });
    };

  return controller;
};
