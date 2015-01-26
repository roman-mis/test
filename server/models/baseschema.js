var fs = require('fs'),
  
  mongoose = require('mongoose');

function BaseSchema(definition,option) {
 
  var opt=option||{};
  if(opt){

    if(!opt.skipCreatedDate && !definition.createdDate){
      definition['createdDate']={type:Date,default:Date.now};
      // console.log('setting createdDate');
    }
    if(!opt.skipUpdatedDate && !definition.updatedDate){
      definition['updatedDate']={type:Date,default:Date.now};
      
    }
    if(!opt.skipUpdatedBy && !definition.updatedBy){
      definition['updatedBy']={type:mongoose.Schema.Types.ObjectId,ref:'User'};
      
    }
  }

  var schm=mongoose.Schema.apply(this,arguments);
  // schm.pre('save',function(next){
  //   //console.log('pre save');
  //   //console.log(this);
  //   // var skipCreatedDate=this.schema.get('skipCreatedDate');
  //   // if( !skipCreatedDate && !this.createdDate){
  //   //   this.createdDate=Date();
  //   // }
  //   // var skipUpdatedDate=this.schema.get('skipUpdatedDate');
  //   // if( !skipUpdatedDate && !this.updatedDate){
  //   //   this.updatedDate=Date();
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
