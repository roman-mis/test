'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		firstName:       {type:String,required:false,trim:true},
    lastName:        {type:String,required:false,trim:true},
    emailAddress:    {type:String},
    phone:            {type:String},
    role:             {type:String},
    status:           {type:String},
    branch:           {type:Schema.Types.ObjectId,ref:'Branch'},
    agency:           {type:Schema.Types.ObjectId,ref:'Agency'},
    user:             {type:Schema.Types.ObjectId,ref:'User'}
	});

	
  	return mongoose.model('Consultant',schema);
};