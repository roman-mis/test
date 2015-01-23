//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema=BaseSchema({
		title:String,
		template_body:String,
		template_type:String
	});

  	return mongoose.model('Template',schema);
}