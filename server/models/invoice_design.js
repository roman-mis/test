'use strict';
//var utils=require('../utils/utils');
// var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		name:String,
		content:String,
	});

  	return mongoose.model('Invoice_Design',schema);
};