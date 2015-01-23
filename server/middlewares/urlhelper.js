module.exports=function(){

	// var base_url;

	return function(req,res,next){
		global.base_url = req.protocol + '://' + req.get('host');
		next();
	};

};

