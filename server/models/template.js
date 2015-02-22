'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		name:String,
		title:String,
		templateBody:String,
		templateType:String,
        subType: String
	});

  	return mongoose.model('Template',schema);
};
