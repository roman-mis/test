//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');
 // var autoIncrement=require('mongoose-auto-increment');
 
module.exports = function(mongoose,autoIncrement) {
  var schema = BaseSchema({
    code:              {type:String,required:true,trim:true},
    emailAddress:    {type:String},
    user:         {type:Schema.Types.ObjectId,ref:'User'},
    codeType: 		{type:String},
    isUsed:          {type:Boolean,default:false}
});

  return mongoose.model('Code',schema);

}
