// 'use strict';

var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
var _=require('lodash');
var mailer=require('../mailing/mailer');
var uuid = require('node-uuid');
var url=require('url');

var utils=require('../utils/utils');

var service={};
service.getUserByEmail=function(email){
	var query=db.User.findOne({emailAddress:email});
	return Q.nfcall(query.exec.bind(query));
	
}


service.getUser=function(id,options){
	// var includes=(options?options.include:[]);
	console.log('finding by id '+id);
	var query=db.User.findById(id);
	return Q.nfcall(query.exec.bind(query));


}

service.getDocumentViewModel=function(document,candidate){
	return {_id:document._id,agency:document.agency,documentType:document.documentType,
		documentName:document.documentName,generatedName:document.generatedName,mimeType:document.mimeType}
}

// service.getWorkerByUser=function(userId){
// 	var query=db.User.FindById(userId);
// 	return Q.nfcall(query.exec.bind(query));
// }

module.exports=service;