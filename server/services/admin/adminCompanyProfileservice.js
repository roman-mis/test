'use strict';
module.exports=function(){

var db 			= require('../../models');
var Q 			= require('q');
var utils=require('../../utils/utils');
// var queryutils 	= require('../../utils/queryutils')(db);
var systemservice = require('../../services/systemservice')(db);
var service = {};

service.updateAdminCompanyProfile = function(name,val){

    var q=Q.defer();
    systemservice.getSystem()
    	.then(function(system){     
    		if(name === 'contact'){
    			utils.updateSubModel(system.companyProfile.contact,val);

		    }else if(name === 'accounts'){
				utils.updateSubModel(system.companyProfile.accounts,val);	

		    }else if(name === 'bankDetails'){
				utils.updateSubModel(system.companyProfile.bankDetails,val);		    	
		    	
		    }else if(name === 'defaults'){
		    	utils.updateSubModel(system.companyProfile.defaults,val);		    	
			}

			 return Q.nfcall(system.save.bind(system)); 
			
    	})
    	 .then(q.resolve,q.reject);

  
	return q.promise;
};

service.saveAdminCompanyProfile = function(name,companyProfile){
	return Q.Promise(function(resolve,reject){
		service.updateAdminCompanyProfile(name,companyProfile).then(function(){
           resolve({});
		},reject);		
	});
};  

return service;
};