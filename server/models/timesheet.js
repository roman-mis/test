'use strict';

var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        worker: { type:Schema.Types.ObjectId, ref:'User' },
        batch: { type:Schema.Types.ObjectId, ref:'TimesheetBatch' },
        status: String, // submitted, preValidation, validated, invoiced, receipted, approved, payrolled
        payFrequency: String, // weekly, 2weekly etc.
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
                isCis: Boolean,
                paymentRate: {
                    name: String,
                    rateType: String,
                    hours: Number,
                }
            }
        ],
        net: Number,
        vat: Number,
        totalPreDeductions: Number,
        deductions: Number,
        total: Number,
        imageUrl: String,
        payrollSettings: {
            holidayPayIncluded: Boolean,
            holidayPayDays: Number,
            employersNiIncluded: Boolean,
            marginChargedToAgency: Boolean
        }
    });

    return mongoose.model('Timesheet',schema);
};