'use strict';
module.exports=function(){

	// var baseUrl;

	return function(req,res,next){
		global.baseUrl = req.protocol + '://' + req.get('host');
		next();
	};

};

