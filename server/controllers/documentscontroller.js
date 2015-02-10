'use strict';

function getFolderPath(req){
    var folder=process.env.S3_TEMP_FOLDER;
    if(req.params.folder && req.params.folder.toLowerCase()==='receipts'){
        folder=process.env.S3_RECEIPT_FOLDER;
        // console.log('process.env.S3_RECEIPT_FOLDER    '+process.env.S3_RECEIPT_FOLDER);
    }

    return folder;
}

module.exports = function(){
  

    var controller={};
    var awsService=require('../services/awsservice');

    controller.getUploadDocumentSignedUrl=function(req,res){
       var objectName=req.query.fileName;
            var objectType=req.query.mimeType;
            // var documentUpload=req.query.documentUpload||false;
            var folder=getFolderPath(req);
            
        awsService.getS3SignedUrl('putObject', objectName,objectType,folder)
        .then(function(returnData){
            res.json(returnData);
           
        },res.sendFailureResponse);
    };

    controller.getViewDocumentSignedUrl=function(req,res){
       var objectName=req.query.fileName;
         //   var objectType=req.query.mimeType;
            // var documentUpload=req.query.documentUpload||false;
            var folder=getFolderPath(req);

        awsService.getS3SignedUrl('getObject', objectName,null,folder)
        .then(function(returnData){
            res.json(returnData);
           
        },res.sendFailureResponse);
    };

    controller.deleteTempDocument=function(req,res){
       var objectName = req.params.fileName;
           // var objectType=req.query.mimeType;
            
            var folder=getFolderPath(req);

        awsService.deleteS3Object(objectName,folder)
        .then(function(){
            res.json({result:true});
            
        },res.sendFailureResponse);
    };

    controller.getUploadReceiptSignedUrl=function(req,res){
      req.params.folder='receipts';
      return controller.getUploadDocumentSignedUrl(req,res);
      
    };

    controller.viewReceipt=function(req,res){
       var objectName=req.query.fileName;
         //   var objectType=req.query.mimeType;
            // var documentUpload=req.query.documentUpload||false;
            var folder=process.env.S3_RECEIPT_FOLDER;

        awsService.getS3SignedUrl('getObject', objectName,null,folder)
        .then(function(returnData){
            res.redirect(returnData.signedRequest);
           
        },res.sendFailureResponse);
    };

    controller.deleteReceipt=function(req,res){
       var objectName = req.params.fileName;
           // var objectType=req.query.mimeType;
            
            var folder=process.env.S3_RECEIPT_FOLDER;

        awsService.deleteS3Object(objectName,folder)
        .then(function(){
            res.json({result:true});
            
        },res.sendFailureResponse);
    };

  return controller;
};
