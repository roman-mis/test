'use strict';

var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose,autoIncrement) {
    var schema = new BaseSchema({
        batchNumber: Number    
    });
    
    schema.plugin(autoIncrement.plugin,{model:'TimesheetBatch',field:'batchNumber',startAt:1,incrementBy:1});

    return mongoose.model('TimesheetBatch',schema);
};