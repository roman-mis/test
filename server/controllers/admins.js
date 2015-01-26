'use strict';

var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
	db = require('../models'),
	router = express.Router(),
	userservice=require('../services/userservice'),
	utils=require('../utils/utils'),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	fs=require('fs'),
	path=require('path')
;
var awsservice=require('../services/awsservice');

module.exports = function(app){
  app.use('/api/admins', router);
};

router.post('/', postAdmin );


function postAdmin(req,res){
	var newUser={
        title:req.body.title,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        emailAddress: req.body.emailAddress,
        userType: 'AM'
      };

    var fullUrl = req.protocol + '://' + req.get('host') +'/register/activate/'+newUser.emailAddress;
      var opt={
          activationLink:fullUrl
      };
      console.log(newUser);
      
      userservice.createUser(opt,newUser)
        .then(function(response){
          console.log('in success ');
          
          var userMod=response.object;
          
                var vm=getUserInfoViewModel(userMod);
                res.json({result:true,object:vm});
          
        },function(error){
           console.log('in failure');
          
           //console.log(error);
           res.sendFailureResponse(error);
        });

}

function getUserInfoViewModel(usr){
  
     return {_id:usr._id,title:usr.title,firstName:usr.firstName,lastName:usr.lastName,emailAddress:usr.emailAddress
    };
}
