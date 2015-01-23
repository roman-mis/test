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
       var object_name=req.query.file_name;
            var object_type=req.query.mime_type;
            // var document_upload=req.query.document_upload||false;
            var folder=process.env.S3_TEMP_FOLDER;

        awsService.getS3SignedUrl('putObject', object_name,object_type,folder)
        .then(function(return_data){
            res.json(return_data);
           
        },res.sendFailureResponse);
    }

    controller.getViewDocumentSignedUrl=function(req,res){
       var object_name=req.query.file_name;
         //   var object_type=req.query.mime_type;
            // var document_upload=req.query.document_upload||false;
            var folder=process.env.S3_TEMP_FOLDER;

        awsService.getS3SignedUrl('getObject', object_name,null,folder)
        .then(function(return_data){
            res.json(return_data);
           
        },res.sendFailureResponse);
    }

    controller.deleteTempDocument=function(req,res){
       var object_name = req.params.fileName;
           // var object_type=req.query.mime_type;
            
            var folder=process.env.S3_TEMP_FOLDER;

        awsService.deleteS3Object(object_name,folder)
        .then(function(return_data){
            res.json({result:true});
            
        },res.sendFailureResponse);
    }

  return controller;
};
