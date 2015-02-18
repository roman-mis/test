'use strict';

var _=require('lodash');

module.exports=function(routeParams){

	return function(req,res,next){
		_.forEach(routeParams,function(routeObj,routeKey){
			_.forEach(routeObj,function(paramValue,paramKey){
				if(_.isUndefined(req[routeKey][paramKey])){
					req[routeKey][paramKey]=paramValue;
				}
			});
		});

		next();
	};
};