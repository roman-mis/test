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
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email_address: req.body.email_address,
        user_type: 'AM'
      };

    var fullUrl = req.protocol + '://' + req.get('host') +'/register/activate/'+newUser.email_address;
      var opt={
          activation_link:fullUrl
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
  
     return {_id:usr._id,title:usr.title,first_name:usr.first_name,last_name:usr.last_name,email_address:usr.email_address
    };
}
