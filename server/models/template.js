'use strict';
//var utils=require('../utils/utils');
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		title:String,
		templateBody:String,
		templateType:String,
        subType: String,
        addedBy: { type:Schema.Types.ObjectId,ref:'User' },
        dateAdded: { type: Date, default: Date.now },
        lastEditedBy: { type:Schema.Types.ObjectId,ref:'User' },
        dateEdited: { type: Date, default: Date.now }
	});

  	return mongoose.model('Template',schema);
};
