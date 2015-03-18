'use strict';



module.exports = function(dbs){
	var db = dbs,
	Q=require('q'),
	queryutils=require('../utils/queryutils')(db);

	var service = {};

	service.getAllTemplates = function(request){
		db.test += 1;
		return Q.Promise(function(resolve,reject){
			var q=db.Template.find();
			queryutils.applySearch(q,db.Template,request)
			.then(resolve,reject);
		});

	};

	service.addTemplate = function(template){

		// console.log('22222222222222222222222222222222222222222222222222222222222222222222222222');
		console.log(db.test);
		var deff = Q.defer();
		var templateModel;
		templateModel = new db.Template(template);
		templateModel.save(function(err){
			if(err){
				deff.reject(err);
			}else{
				console.log('save success');
				deff.resolve(templateModel);
			}
		});
		return deff.promise;
	};

	service.getTemplate=function(id){
		var q=db.Template.findById(id);
		return Q.nfcall(q.exec.bind(q));
	};

	return service;

};