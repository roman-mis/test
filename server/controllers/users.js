'use strict';


module.exports = function(dbs){
  var express = require('express'),
    jwt = require('jsonwebtoken'),
    db = dbs,
    router = express.Router(),
    userservice=require('../services/userservice'),
    enums=require('../utils/enums');

    var controller={};


    controller.emailValidation=function(req,res){
      userservice.checkDuplicateUser(req.params.email_address)
        .then(function(){
          res.json({result:true});
        },res.sendFailureResponse);
      
    };

    controller.lockunlock=function(req,res){
    	userservice.lockunlock(req.params.id,req.params.flag,req.user.id)
    	.then(function(user){
    		res.json({result:true});
    	},res.sendFailureResponse);
    }

    controller.getActivation =function (req,res){
      userservice.isActivationCodeValid(req.params.email_address,req.query.verification_code)
        .then(function(){
          console.log(true);
          res.json({result:true});
        },function(){
          console.log(false);
          res.json({result:false,message:'Invalid code'});
        });
        
    }


    controller.postActivation=function (req,res){
      console.log('verifying code : '+req.body.verification_code);
      userservice.isActivationCodeValid(req.params.email_address,req.body.verification_code)
        .then(function(activation_code){
          console.log('activating code : '+req.body.verification_code);

          userservice.activateUser(activation_code,req.body.new_password)
          .then(function(){
            res.json({result:true});
          },function(err){
            res.sendFailureResponse(err);
          });
          
        },function(err){
          console.log(false);
          res.json({result:false,message:'Invalid code'});
        });
        
    }



    controller.getAllUsers=function(req,res){
    	userservice.getAllUsers(req._restOptions)
    		.then(function(result){
    			 var vms=_.map(result.rows,function(user){
          
    	   			var vm=getUserViewModel(user);
    	       		return vm;
          
        		});
        
    		    var pagination=req._restOptions.pagination||{};
    		    var resp={result:true,objects:vms,meta:{limit:pagination.limit,offset:pagination.offset,total_count:result.count}};
    		    
    		    res.json(resp);

    		},res.sendFailureResponse);

    }

    controller.verifyChangePassword=function(req,res){
        userservice.verifyCode(req.params.email_address,req.params.code,enums.code_types.ChangePassword)
          .then(function(response){
              res.json(response);
          },res.sendFailureResponse);
    }

    controller.changePassword=function(req,res){
      userservice.changePassword(req.params.email_address,req.params.code,req.body.new_password)
          .then(function(response){
              if(response.result){
                res.json({result:true});
              }
              else{
                res.json(response);  
              }
              
          },res.sendFailureResponse);
    }


    function getUserViewModel(user){
      return {
        _id:user._id,title:user.title,first_name:user.first_name,last_name:user.last_name,
        email_address:user.email_address
      };
    }

  return controller;
};
