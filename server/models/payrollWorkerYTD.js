'use strict';

var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        worker: { type: Schema.Types.ObjectId, ref:'User' },
        mileage: Number,
        taxableEarnings: Number,
        taxPaid: Number,
        ni: {
            lowerLimit: Number,
            upperLimit: Number,
            niPaid: {
                employees: Number,
                employers: Number
            }
        },
        totalPay: Number,
        smp: Number,
        spp: Number,
        studentLoan: Number,
        sap: Number,
        additionalSPP: Number,
        additionalShPP: Number,
        rti: {
            niCategory: String,
            
        }
    });
    
    return mongoose.model('PayrollWorkerYTD',schema);
};