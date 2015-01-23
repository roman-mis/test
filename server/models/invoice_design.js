//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema=BaseSchema({
		name:String,
		content:String,
	});

  	return mongoose.model('Invoice_Design',schema);
}