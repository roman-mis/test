//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema=BaseSchema({
		user:{type:Schema.Types.ObjectId,ref:'User'},
		agency:{type:Schema.Types.ObjectId,ref:'Agency'},
		agency_name:String,
		consultant:{type:Schema.Types.ObjectId,ref:'Agency.branches.consultants'},
		paye_rate:Number,
		outsourced_rate:Number,
		service_used:String,
		requirements:[
				String
		]
	});

  	return mongoose.model('Pending_Onboarding',schema);
}