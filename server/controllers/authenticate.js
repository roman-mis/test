'use strict';



module.exports = function(dbs){
  var express = require('express'),
    db = dbs,
    jwt = require('jsonwebtoken'),
    candidateservice=require('../services/candidateservice');

  var controller={};


  controller.authenticate =function(req, res) {

    candidateservice.authenticateUser(req.body.emailAddress,req.body.password)
    .then(function(user){
      var vm=getUserViewModel(user);
      var token = jwt.sign(vm, process.env.JWTSECRET, {expiresInMinutes:60*200});
      
        res.json({result:true,token:token,object:vm});  
    },
    function(err){
      res.sendFailureResponse(err);
    });

  };
  
  function getUserViewModel(user){
    return {id:user._id,_id:user._id,title:user.title,
      firstName:user.firstName,lastName:user.lastName,
      emailAddress:user.emailAddress,userType:user.userType,
      avatarUrl:(user.avatarFileName?'api/candiates/'+user.id+'/'+user.avatarFileName:'')
          }
  }


  return controller;
};

