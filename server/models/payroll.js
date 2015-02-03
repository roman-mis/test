'use strict';

var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        weekNumber: Number,
        monthNumber: Number,
        periodType: String, // weekly, twoWeekly, fourWeekly, monthly
        createdDate: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref:'User' }
    });
    
    return mongoose.model('Payroll',schema);
};