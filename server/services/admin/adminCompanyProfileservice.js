'use strict';
module.exports=function(db){

var db 			= require('../../models');
var Q 			= require('q');
var queryutils 	= require('../../utils/queryutils')(db);
var systemservice = require('../../services/systemservice')(db);
var service = {};

service.updateAdminCompanyProfile = function(id,name,val){
console.log(val);
    var q=Q.defer();
    if(name==='profile'){
    	db.System.update({'_id':id},{$set:{'companyProfile.contact':val}},function(err){
			if(err){
			q.reject(err);
			}else{
				q.resolve({});
			}
		}) 
    }else if(name === 'accounts'){
    	db.System.update({'_id':id},{$set:{'companyProfile.accounts':val}},function(err){
			if(err){
			q.reject(err);
			}else{
				q.resolve({});
			}
		}) 
    }else if(name === 'bankDetails'){
    	db.System.update({'_id':id},{$set:{'companyProfile.bankDetails':val}},function(err){
			if(err){
			q.reject(err);
			}else{
				q.resolve({});
			}
		}) 
    }else if(name === 'defaults'){
    	db.System.update({'_id':id},{$set:{'companyProfile.defaults':val}},function(err){
			if(err){
			q.reject(err);
			}else{
				q.resolve({});
			}
		}) 
    }
  
	return q.promise;
};

service.saveAdminCompanyProfile = function(id,name,companyProfile){
	console.log(id);
	return Q.Promise(function(resolve,reject){
		service.updateAdminCompanyProfile(id,name,companyProfile).then(function(){
           resolve({});
		},reject);		
	});
};  

return service;
};