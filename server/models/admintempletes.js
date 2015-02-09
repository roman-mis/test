'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {

	var schema = new BaseSchema({
		templateName: 			     {type:String},
		templateType: 			     {type:String},
		mergeFields: 			     {type:String},
		templatTitle: 			     {type:String},
		body:						 {type:String}
	},{
		skipUpdatedBy:true
	});
	return mongoose.model('adminTemplates',schema);
}