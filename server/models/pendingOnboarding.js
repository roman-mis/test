'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		user:{type:Schema.Types.ObjectId,ref:'User'},
		agency:{type:Schema.Types.ObjectId,ref:'Agency'},
		agencyName:String,
		consultant:{type:Schema.Types.ObjectId,ref:'Consultant'},
		payeRate:Number,
		outsourcedRate:Number,
		serviceUsed:String,
		requirements:[
			String
		]
	});

  	return mongoose.model('PendingOnboarding',schema);
};