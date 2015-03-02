'use strict';
//var utils=require('../utils/utils');
// var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		templateName:String,
		templateType:String,
        items: Array
	});

  	return mongoose.model('importExportTemplates',schema);
};
