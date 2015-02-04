'use strict';

var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        worker: { type: Schema.Types.ObjectId, ref:'User' },
        payroll: { type: Schema.Types.ObjectId, ref:'Payroll' },
        nmw: Number,
        hoursWorked: Number,
        totalPayForNmw: Number,
        marginTotal: Number,
        holidayPay: {
            forNmw: Number,
            taken: Number,
            value: Number
        },
        expenses: {
            total: Number,
            allowed: Number,
            used: [
                Schema.Types.Mixed
            ]
        },
        ni: {
            lowerLimit: Number,
            upperLimit: Number,
            total: Number,
            actualEmployers: Number,
            employersOnNmw: Number,
        },
        tax: {
            basicRate: Number,
            higherRate: Number,
            additionalRate: Number,
            total: Number
        },
        grossTimesheetValue: Number,
        deductions: {
            studentLoan: Number,
            attachmentOfEarnings: Number
        },
        statutoryPayments: {
            ssp: Number,
            smp: Number,
            spp: Number
        },
        netPay: Number,
        
    });
    
    return mongoose.model('PayrollWorker',schema);
};