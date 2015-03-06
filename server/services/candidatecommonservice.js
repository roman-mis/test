'use strict';

module.exports=function(dbs){

	var db = dbs;
	var Q=require('q');
	// var Promise=require('promise');
	var service={};
	service.getUserByEmail=function(email){
		var query=db.User.findOne({emailAddress:email});
		return Q.nfcall(query.exec.bind(query));
		
	};


	service.getUser=function(id){
		// var includes=(options?options.include:[]);
		console.log('finding by id '+id);
		var query=db.User.findById(id);
		return Q.nfcall(query.exec.bind(query));

	};

	service.getUserByRef=function(ref){
		console.log('finding by candidateRef '+ref);
		ref = Number(ref);
		var query=db.User.findOne({candidateNo:ref});
		return Q.nfcall(query.exec.bind(query));
	};

	service.getDocumentViewModel=function(document){
		return {_id:document._id,agency:document.agency,documentType:document.documentType,
			documentName:document.documentName,generatedName:document.generatedName,mimeType:document.mimeType};
	};

	return service;

};