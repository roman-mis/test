'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		assignee:{type:Schema.Types.ObjectId,ref:'User'},
		owner:{type:Schema.Types.ObjectId,ref:'User'},
		user:{type:Schema.Types.ObjectId,ref:'User'},
		agency:{type:Schema.Types.ObjectId,ref:'Agency'},
		priority:String,
		taskType:String,
		status:String,
		templateHtml:String,
		template:{type:Schema.Types.ObjectId,ref:'Template'},
		templateTitle:String,
		followUpTaskDate:Date,
		notifyMe:Boolean,
		completedDate:Date,
		taskCategory: {type:String, required:true,trim:true}
	});

  	return mongoose.model('Task',schema);
};