//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema=BaseSchema({
		user:{type:Schema.Types.ObjectId,ref:'User'},
		agency:{type:Schema.Types.ObjectId,ref:'Agency'},
		agencyName:String,
		consultant:{type:Schema.Types.ObjectId,ref:'Agency.branches.consultants'},
		payeRate:Number,
		outsourcedRate:Number,
		serviceUsed:String,
		requirements:[
				String
		]
	});

  	return mongoose.model('Pending_Onboarding',schema);
}