'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');
 // var autoIncrement=require('mongoose-auto-increment');
 
module.exports = function(mongoose) {
  var schema = new  BaseSchema({
    code:              {type:String,required:true,trim:true},
    emailAddress:    {type:String},
    user:         {type:Schema.Types.ObjectId,ref:'User'},
    codeType: 		{type:String},
    isUsed:          {type:Boolean,default:false}
});

  return mongoose.model('Code',schema);

};
