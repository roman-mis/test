//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
  	var schema = BaseSchema({
  		eventType: 				{type:String, required:true,trim:true},
  		eventDate:{type:Date,required:true,default:Date.now},
  		historyBy:{type:Schema.Types.ObjectId,ref:'User'}, /*current user*/
  		user:{type:Schema.Types.ObjectId,ref:'User'},/*candidate*/
  		eventData:Schema.Types.Mixed,
  		notes:String

  		
	},{skipCreatedDate:true,skipUpdatedDate:true,skipUpdatedBy:true});
	
  	return mongoose.model('History',schema);
}