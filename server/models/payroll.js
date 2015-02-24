'use strict';

var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        weekNumber: Number,
        monthNumber: Number,
        periodType: String, // weekly, twoWeekly, fourWeekly, monthly
        isCurrent: Boolean,
        date: Date,
        createdDate: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref:'User' },
        stats: {
            schedulesUploaded: Number,
            validationsApproved: Number,
            invoicesSent: Number,
            invoicesReceipted: Number,
            awaitingPayroll: Number,
            payrollsUnpaid: Number
        },
        agencies: [
            {
                agency: { type: Schema.Types.ObjectId, ref:'Agency' },
                scheduleReceived: Boolean,
                timesheetsUploaded: Boolean,
                expensesUploaded: Boolean,
                marginUploaded: Boolean,
                validationCreated: Boolean,
                validationSent: Boolean,
                validationReceived: Boolean,
                invoiceRaised: Boolean,
                invoiceSent: Boolean,
                moneyReceived: Boolean,
                payrollRun: Boolean,
                bacsUploaded: Boolean,
                paymentConfirmed: Boolean,
                reportsCreated: Boolean
            }
        ]
    });
    
    return mongoose.model('Payroll',schema);
};