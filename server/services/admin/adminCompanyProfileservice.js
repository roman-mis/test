'use strict';
module.exports=function(db){

var db 			= require('../../models');
var Q 			= require('q');
var utils=require('../../utils/utils');
// var queryutils 	= require('../../utils/queryutils')(db);
var systemservice = require('../../services/systemservice')(db);
var service = {};

service.updateAdminCompanyProfile = function(id,name,val){
console.log(val);
    var q=Q.defer();
    systemservice.getSystem()
    	.then(function(system){
    		
    		////console.log(system);
    		if(name.toLowerCase()==='profile'){
    			utils.updateSubModel(system.contact,val);

		    }else if(name.toLowerCase() === 'accounts'){
				utils.updateSubModel(system.accounts,val);		    	
		    }else if(name.toLowerCase() === 'bankdetails'){
				utils.updateSubModel(system.bankDetails,val);		    	
		    	
		    }else if(name.toLowerCase() === 'defaults'){
		    	utils.updateSubModel(system.defaults,val);		    	
			}
			//console.log('system.save');
				console.log('------system-------');
			 return Q.nfcall(system.save.bind(system));
			
    	})
    	 .then(q.resolve,q.reject);

  
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