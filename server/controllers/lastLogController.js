'use strict';

module.exports = function(dbs){
		var _=require('lodash');
        
  var lastlogservice=require('../services/lastlogservice')(dbs);
      var controller={};


      controller.getRecentLogs=function(req,res){ 
   

         lastlogservice.getLastlog(req.params.id,['User','Task','Expense']).then(function(d){

             res.json(d);
             
         },res.sendFailureResponse)

      };

      return controller;



}