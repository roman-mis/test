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
    path=require('path');

    var awsservice=require('../services/awsservice');
    var enums=require('../utils/enums');
    var _=require('lodash');
    var controller={};
    var awsService=require('../services/awsservice');



    controller.getUploadDocumentSignedUrl=function(req,res){
       var objectName=req.query.fileName;
            var objectType=req.query.mimeType;
            // var documentUpload=req.query.documentUpload||false;
            var folder=process.env.S3TEMPFOLDER;

        awsService.getS3SignedUrl('putObject', objectName,objectType,folder)
        .then(function(returnData){
            res.json(returnData);
           
        },res.sendFailureResponse);
    }

    controller.getViewDocumentSignedUrl=function(req,res){
       var objectName=req.query.fileName;
         //   var objectType=req.query.mimeType;
            // var documentUpload=req.query.documentUpload||false;
            var folder=process.env.S3TEMPFOLDER;

        awsService.getS3SignedUrl('getObject', objectName,null,folder)
        .then(function(returnData){
            res.json(returnData);
           
        },res.sendFailureResponse);
    }

    controller.deleteTempDocument=function(req,res){
       var objectName = req.params.fileName;
           // var objectType=req.query.mimeType;
            
            var folder=process.env.S3TEMPFOLDER;

        awsService.deleteS3Object(objectName,folder)
        .then(function(returnData){
            res.json({result:true});
            
        },res.sendFailureResponse);
    }

  return controller;
};
