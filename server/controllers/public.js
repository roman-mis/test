'use strict';


module.exports = function(dbs){
      var express = require('express'),
        jwt = require('jsonwebtoken'),
        db = dbs,
        router = express.Router(),
        candidateservice=require('../services/candidateservice'),

        aws = require('aws-sdk'),
        mailer=require('../mailing/mailer'),
        path=require('path'),
        awsService=require('../services/awsservice'),
        userservice=require('../services/userservice'),
        URL=require('url'),
        logger=require('../utils/logger');

        var Schema=require('mongoose').Schema;
    var bcrypt=require('bcryptjs');
    var utils=require('../utils/utils');

    var controller={};

    controller.emailValidation=function(req,res){
      userservice.checkDuplicateUser(req.params.emailAddress)
        .then(function(){
          res.json({result:true});
        },res.sendFailureResponse);
      // console.log('')
      // candidateservice.getUserByEmail(req.params.emailAddress)
      //   .then(function(user){
      //   if(user==null){
      //     res.json({result:true});
      //   }
      //   else{
      //     res.json({result:false});
      //   }

      // });
    };


    controller.signS3=function(req, res){
      
            var objectName=req.query.s3ObjectName;
            var objectType=req.query.s3ObjectType;
            var documentUpload=req.query.documentUpload||false;
            var folder=documentUpload?process.env.S3TEMPFOLDER:process.env.S3P45TEMPFOLDER;

        awsService.getS3SignedUrl('putObject', objectName,objectType,folder)
        .then(function(returnData){
            res.json(returnData);
            res.end();
        },function(err){
            console.log(err);
            res.json(err);
        });

    };

    controller.getFile=function(req,res){
        var awsConfig={
          AWSACCESSKEY:process.env.AWSACCESSKEY,
          AWSSECRETKEY:process.env.AWSSECRETKEY,
          S3BUCKET : process.env.S3BUCKET
        };



        aws.config.update({
            accessKeyId: awsConfig.AWSACCESSKEY,
            secretAccessKey: awsConfig.AWSSECRETKEY
        });
        var s3 = new aws.S3();
        var s3Params = {
            Bucket: awsConfig.S3BUCKET,
            Key: req.params.filename
        };

        //var file = require('fs').createWriteStream(path.normalize(__dirname+'/'+req.params.filename));
        
        console.log('file retrieval started for : '+req.params.filename);
        s3.getObject(s3Params
          ,function(err,data){
              console.log('done');
              
              if(err){

                console.log(err);
                res.json('false');
              }
              else{
                console.log(data);
                res.json('true');
              }

              
          });

        //).createReadStream().pipe(file);
        // s3.getObject(s3Params).
        //   on('httpData', function(chunk) { 
        //     console.log('chunk received '+chunk);
        //     file.write(chunk); }).
        //   on('httpDone', function() { 
        //     console.log('done ');
        //     file.end();res.json('true'); });

    };

    controller.testlogger=function(req,res){
      logger.debug('debug');
      logger.info('info');
      logger.error('error');

      res.json('logged');
    }

    controller.testMailing=function(req,res){
      var to=req.body.to;
      var subject='Test email subject';
      var model={name:req.body.name,message:req.body.message};
     

      mailer.sendEmail({to:to,subject:subject},model,'sampletemplate')
      .then(function(result){
        console.log('success');
        res.json(result);
      },function(err){
        console.log('failure');
        res.json(err);
      })
      ;

    };


    controller.verifyBcrypt=function(req,res){
      utils.secureString(req.params.password)
      .then(function(encryptedPassword){
        res.json('Password encrypted to '+encryptedPassword);
        utils.compareSecureString(encryptedPassword,req.params.password)
          .then(console.log)
          .then(function(){
              console.log('Trying with wrong password');
              utils.compareSecureString(encryptedPassword,'wrongpassword').
              then(console.log);

          });
        

      },function(err){
        // console.log('error occured');
        res.json(err);
      });

      return;
      bcrypt.genSalt(10, function(err, salt) {
          if(err){
            console.log(err);
          }
          else{
            bcrypt.hash(req.params.password, salt, function(err, hash) {
                // Store hash in your password DB.
                console.log('hash generated : '+hash);
                bcrypt.compare(req.params.password,hash,function(err,result){
                    console.log('Result : '+result);
                    if(!result){
                      console.log(err);
                    }

                    console.log('Trying with wrong password');

                    bcrypt.compare('wrong password',hash,function(err,result){
                        console.log('Result : '+result);
                        if(!result){
                          console.log(err);
                        }
                        res.send('done');
                        res.end();
                    });

                });
                

                 
            });
          }
      });

    };


    controller.copyS3=function(req, res){
            
            var objectSource=req.query.s3ObjectName;
            var objectName=_.last(req.query.s3ObjectName.split('/'));
            var id=req.query.id;
            //var objectType=req.query.s3ObjectType;

        awsService.copyS3Object(objectSource,objectName,process.env.S3P45FOLDER+id+'/')
        .then(function(returnData){
            res.json(returnData);
            res.end();
        },function(err){
            //console.log(err);
            res.json(err);
        });

    };

    controller.moveS3 = function(req, res){
            
            var objectSource=req.query.s3ObjectName;
            var objectName=_.last(req.query.s3ObjectName.split('/'));
            var id=req.query.id;
            //var objectType=req.query.s3ObjectType;

        awsService.moveS3Object(process.env.S3P45TEMPFOLDER+objectSource,objectName,process.env.S3P45FOLDER+id+'/')
        .then(function(returnData){
            res.json(returnData);
            res.end();
        },function(err){
            //console.log(err);
            res.json(err);
        });

    };

    controller.addagencybranch =function(req,res){
      db.DB.model('Agency').findById(req.params.id,function(err,agency){
        console.log(agency);
        if(agency){
          var branch={
            name:req.body.name
          };
          agency.branches.push(branch);
          agency.save(function(err,branch){
            if(!err){
              res.sendFailureResponse(err);
            }
            else{
              res.json(agency);
            }
          });
        }else{
            return res.sendFailureResponse(err);
        }
            


      });
    };

    controller.agencies=function(req,res){
      db.DB.model('Agency').find(function(err,agencies){
        res.json(agencies);
      });
    };

    controller.branches = function(req,res){
      //db.DB.model('AgencyBranch').find(function(err,agencies){
        res.json(null);
      //});
    };

    controller.testagencypopulate =function(req,res){
      db.DB.model('Agency').find({'branches.name':req.query.branchName},function(err,agencies){
        res.json(agencies);
      });
    };

    controller.testagencybybranchid = function(req,res){
      db.DB.model('Agency').find({'branches._id':req.query.branchId},function(err,agencies){
        res.json(agencies);
      });
    };

    controller.setcandidatebranch =function(req,res){
      db.DB.model('Agency').find({'branches._id':req.query.branchId},function(err,agencies){
        res.json(agencies);
      });
    };

    controller.putagencybranchincandidate = function(req,res){
      db.DB.model('User').findById(req.params.id,function(err,user){
        if(user){
          user.branchId=Schema.Types.ObjectId(req.query.branchId);
          user.save(function(err,us){
            if(err){
              res.json(err);
            }
            else{
              res.json(us);  
            }
            
          });
        }
        else{
          res.json(err);
        }
      });
    };

    controller.getuserwithbranchpopulate = function(req,res){
      db.DB.model('User').findById(req.params.id).populate('branch').exec(function(err,user){
        res.json(user);
      });
    };

    controller.getAllUsers=function(req,res){
      db.User.find()
      .exec(function(err,users){
        
          res.json(users);
        
      });
    };

    controller.getUser=function(req,res){
      db.User.findById(req.params.id)
      .exec(function(err,user){
        
          res.json(user);
        
      });
    };
  return controller;
};
