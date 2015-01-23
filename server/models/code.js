//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');
 // var autoIncrement=require('mongoose-auto-increment');
 
module.exports = function(mongoose,autoIncrement) {
  var schema = BaseSchema({
    code:              {type:String,required:true,trim:true},
    email_address:    {type:String},
    user:         {type:Schema.Types.ObjectId,ref:'User'},
    code_type: 		{type:String},
    is_used:          {type:Boolean,default:false}
});

  return mongoose.model('Code',schema);

}
