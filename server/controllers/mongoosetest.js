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
          contact_number: req.body.contact_number,
          ni_number:      req.body.ni_number,
          birth_date:     req.body.birth_date,
          address_1:    req.body.address_1,
          address_2:      req.body.address_2,
          address_3:      req.body.address_3,
          town:           req.body.town,
          county:         req.body.county,
          post_code:      req.body.post_code,
          gender:         req.body.gender,
          nationality:    req.body.nationality,
          arrival_date:   utils.nullifyDate(req.body.arrival_date),
          recent_dep_date:utils.nullifyDate(req.body.recent_dep_date),
          emp_last_visit: req.body.emp_last_visit,
          agency_name:    req.body.agency_name,
          job_title:      req.body.job_title,
          start_date:     req.body.start_date
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
        first_name:req.body.first_name + new Date().getTime().toString(),
        last_name:req.body.last_name,
        email_address: req.body.email_address,
        user_type: 'WK'
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