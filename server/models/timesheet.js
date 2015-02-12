'use strict';

var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        worker: { type:Schema.Types.ObjectId, ref:'User' },
        batch: { type:Schema.Types.ObjectId, ref:'TimesheetBatch' },
        status: String, // submitted, preValidation, validated, invoiced, receipted, approved, payrolled
        weekEndingDate: Date,
        elements: [
            {
                elementType: String,
                description: String,
                units: Number,
                payRate: Number,
                chargeRate: Number,
                amount: Number,
                vat: Number,
                isCis: Boolean
            }
        ],
        net: Number,
        vat: Number,
        totalPreDeductions: Number,
        deductions: Number,
        total: Number,
        imageUrl: String
    });

    return mongoose.model('Timesheet',schema);
};