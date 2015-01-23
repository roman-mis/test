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
    candidatecommonservice = require('../services/candidatecommonservice'),
    historyservice = require('../services/historyservice');
    var awsservice=require('../services/awsservice');
    var enums=require('../utils/enums')

    var controller={};


    controller.patchDpa=function(req,res){
      var dpaDetails = {
        event_type: enums.event_type.DPANOTE,
        event_date: new Date(),
        history_by: req.user._id,
        user: req.params.id,
        event_data: null,
        notes: 'DPA updated by ' + req.user.first_name + ' ' + req.user.last_name
      };

      historyservice.saveDpa(req.params.id, dpaDetails).then(function(response){
        res.json({result:true});
        },function(err){
         res.sendFailureResponse(err);
      });
    }

  return controller;
};
