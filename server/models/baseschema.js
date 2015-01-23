var fs = require('fs'),
  
  mongoose = require('mongoose');

function BaseSchema(definition,option) {
 
  var opt=option||{};
  if(opt){

    if(!opt.skipCreatedDate && !definition.created_date){
      definition['created_date']={type:Date,default:Date.now};
      // console.log('setting created_date');
    }
    if(!opt.skipUpdatedDate && !definition.updated_date){
      definition['updated_date']={type:Date,default:Date.now};
      
    }
    if(!opt.skipUpdatedBy && !definition.updated_by){
      definition['updated_by']={type:mongoose.Schema.Types.ObjectId,ref:'User'};
      
    }
  }

  var schm=mongoose.Schema.apply(this,arguments);
  // schm.pre('save',function(next){
  //   //console.log('pre save');
  //   //console.log(this);
  //   // var skipCreatedDate=this.schema.get('skipCreatedDate');
  //   // if( !skipCreatedDate && !this.created_date){
  //   //   this.created_date=Date();
  //   // }
  //   // var skipUpdatedDate=this.schema.get('skipUpdatedDate');
  //   // if( !skipUpdatedDate && !this.updated_date){
  //   //   this.updated_date=Date();
  //   // }
  //   next();
  // });
// console.log('lets check option');
// console.log(option);

  // this.add({
  //   name: String,
  //   createdAt: Date
  //});
  return schm;
}
// uti

module.exports = BaseSchema;
