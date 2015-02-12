'use strict';

var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        agency: { type: Schema.Types.ObjectId, ref:'Agency' },
           
    });
    
    return mongoose.model('Invoice',schema);
};