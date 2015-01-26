'use strict';

var express = require('express'),
    utils=require('../utils/utils'),
    db = require('../models'),
    router = express.Router();

module.exports = function(app){
  app.use('/api/mongoosetest', router);
};

router.get('/worker', function(req, res){
   
        db.Worker.find().exec(function(err,mods){
          if(err){
            res.json(err);
          }
          else{
            res.json(mods);  
          }
          
        });
     
});
router.post('/worker',function(req,res){
   var worker={
          contactNumber: req.body.contactNumber,
          niNumber:      req.body.niNumber,
          birthDate:     req.body.birthDate,
          address1:    req.body.address1,
          address2:      req.body.address2,
          address3:      req.body.address3,
          town:           req.body.town,
          county:         req.body.county,
          postCode:      req.body.postCode,
          gender:         req.body.gender,
          nationality:    req.body.nationality,
          arrivalDate:   utils.nullifyDate(req.body.arrivalDate),
          recentDepDate:utils.nullifyDate(req.body.recentDepDate),
          empLastVisit: req.body.empLastVisit,
          agencyName:    req.body.agencyName,
          jobTitle:      req.body.jobTitle,
          startDate:     req.body.startDate
      }

    var workerModel=new db.Worker(worker);
    workerModel.save(function(err,mod){
      if(err){
        res.json(err);
      }else{
        
          res.json(mod);
        
      }
    });
});

router.post('/',function(req,res){
  var newUser={
        title:req.body.title,
        firstName:req.body.firstName + new Date().getTime().toString(),
        lastName:req.body.lastName,
        emailAddress: req.body.emailAddress,
        userType: 'WK'
      };

    var usr=new db.User(newUser);
    usr.save(function(err,usr){
      if(err){
        res.json(err);
      }else{
        
          res.json(usr);
        
      }
    });
});
router.get('/', function(req, res){
   
        db.User.find().exec(function(err,users){
          if(err){
            res.json(err);
          }
          else{
            res.json(users);  
          }
          
        });
     
});