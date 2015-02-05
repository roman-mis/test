'use strict';


module.exports = function(){
  var userservice=require('../services/userservice'),
    enums=require('../utils/enums');

    var controller={};


    controller.emailValidation=function(req,res){
      userservice.checkDuplicateUser(req.params.emailAddress)
        .then(function(){
          res.json({result:true});
        },res.sendFailureResponse);
      
    };

    controller.lockunlock=function(req,res){
    	userservice.lockunlock(req.params.id,req.params.flag,req.user.id)
    	.then(function(){
    		res.json({result:true});
    	},res.sendFailureResponse);
    };

    controller.getActivation =function (req,res){
      userservice.isActivationCodeValid(req.params.emailAddress,req.query.verificationCode)
        .then(function(){
          console.log(true);
          res.json({result:true});
        },function(){
          console.log(false);
          res.json({result:false,message:'Invalid code'});
        });
        
    };


    controller.postActivation=function (req,res){
      console.log('verifying code : '+req.body.verificationCode);
      userservice.isActivationCodeValid(req.params.emailAddress,req.body.verificationCode)
        .then(function(activationCode){
          console.log('activating code : '+req.body.verificationCode);

          userservice.activateUser(activationCode,req.body.newPassword)
          .then(function(){
            res.json({result:true});
          },function(err){
            res.sendFailureResponse(err);
          });
          
        },function(){
          console.log(false);
          res.json({result:false,message:'Invalid code'});
        });
        
    };



    controller.getAllUsers=function(req,res){
    	userservice.getAllUsers(req._restOptions)
    		.then(function(result){
    			 var vms=_.map(result.rows,function(user){
          
    	   			var vm=getUserViewModel(user);
    	       		return vm;
          
        		});
        
    		    var pagination=req._restOptions.pagination||{};
    		    var resp={result:true,objects:vms,meta:{limit:pagination.limit,offset:pagination.offset,totalCount:result.count}};
    		    
    		    res.json(resp);

    		},res.sendFailureResponse);

    };

    controller.verifyChangePassword=function(req,res){
        userservice.verifyCode(req.params.emailAddress,req.params.code,enums.codeTypes.ChangePassword)
          .then(function(response){
              res.json(response);
          },res.sendFailureResponse);
    };

    controller.changePassword=function(req,res){
      userservice.changePassword(req.params.emailAddress,req.params.code,req.body.newPassword)
          .then(function(response){
              if(response.result){
                res.json({result:true});
              }
              else{
                res.json(response);  
              }
              
          },res.sendFailureResponse);
    };

    controller.getUser=function(req,res){
        userservice.getUser(req.params.id)
          .then(function(user){
            if(user){
              var userVm=getUserViewModel(user);
              res.json({result:true,object:userVm});
            }
            else{
              res.json({result:false,message:'User not found'});
            }
          },res.sendFailureResponse);
    };


    function getUserViewModel(user){
      return {
        _id:user._id,title:user.title,firstName:user.firstName,lastName:user.lastName,
        emailAddress:user.emailAddress
      };
    }

  return controller;
};
