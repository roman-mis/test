//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
  	var schema = BaseSchema({
  		event_type: 				{type:String, required:true,trim:true},
  		event_date:{type:Date,required:true,default:Date.now},
  		history_by:{type:Schema.Types.ObjectId,ref:'User'}, /*current user*/
  		user:{type:Schema.Types.ObjectId,ref:'User'},/*candidate*/
  		event_data:Schema.Types.Mixed,
  		notes:String

  		
	},{skipCreatedDate:true,skipUpdatedDate:true,skipUpdatedBy:true});
	
  	return mongoose.model('History',schema);
}