'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		name: String,
        addedBy: { type:Schema.Types.ObjectId,ref:'User' },
        dateAdded: { type: Date, default: Date.now },
        lastEditedBy: { type:Schema.Types.ObjectId,ref:'User' },
        dateEdited: { type: Date, default: Date.now },
        type: String,
        headerLineOne: Boolean,
        fields: [
            {
                orderNumber: Number,
                name: String
            }
        ]
	});

  	return mongoose.model('ImportExportTemplate',schema);
};
