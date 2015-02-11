'use strict';

var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        
    });

    return mongoose.model('Timesheet',schema);
};