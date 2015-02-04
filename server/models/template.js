'use strict';
//var utils=require('../utils/utils');
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		title:String,
		templateBody:String,
		templateType:String
	});

  	return mongoose.model('Template',schema);
};