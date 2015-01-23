'use strict';



module.exports = function(dbs){
  var express = require('express'),
    db = dbs,
    jwt = require('jsonwebtoken'),
    candidateservice=require('../services/candidateservice');

  var controller={};


  controller.authenticate =function(req, res) {

    candidateservice.authenticateUser(req.body.email_address,req.body.password)
    .then(function(user){
      var vm=getUserViewModel(user);
      var token = jwt.sign(vm, process.env.JWT_SECRET, {expiresInMinutes:60*200});
      
        res.json({result:true,token:token,object:vm});  
    },
    function(err){
      res.sendFailureResponse(err);
    });

  };
  
  function getUserViewModel(user){
    return {id:user._id,_id:user._id,title:user.title,
      first_name:user.first_name,last_name:user.last_name,
      email_address:user.email_address,user_type:user.user_type,
      avatar_url:(user.avatar_file_name?'api/candiates/'+user.id+'/'+user.avatar_file_name:'')
          }
  }


  return controller;
};

