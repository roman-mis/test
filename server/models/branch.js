//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	

	var schema=BaseSchema({
		name:{type:String,required:true},
    address1:            {type:String},
    address2:            {type:String},
    address3:            {type:String},
		town:                {type:String},
    postCode:            {type:String},
    branchType:         {type:String},
    agency:             {type:Schema.Types.ObjectId,ref:'Agency'},
		consultants:[{type:Schema.Types.ObjectId,ref:'Consultant'}]
	});


  	return mongoose.model('Branch',schema);
}
