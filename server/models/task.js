//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema=BaseSchema({
		assignee:{type:Schema.Types.ObjectId,ref:'User'},
		owner:{type:Schema.Types.ObjectId,ref:'User'},
		user:{type:Schema.Types.ObjectId,ref:'User'},
		agency:{type:Schema.Types.ObjectId,ref:'Agency'},
		priority:String,
		task_type:String,
		status:String,
		template_html:String,
		template:{type:Schema.Types.ObjectId,ref:'Template'},
		template_title:String,
		follow_up_task_date:Date,
		notify_me:Boolean,
		completed_date:Date,
		task_category: {type:String, required:true,trim:true}
	});

  	return mongoose.model('Task',schema);
}