'use strict';

var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        agency: { type:Schema.Types.ObjectId, ref:'Agency' },
        worker: { type:Schema.Types.ObjectId, ref:'User' },
        status: String,
        weekEndingDate: Date,
        addedBy: { type:Schema.Types.ObjectId, ref:'User' },
        dateAdded: { type: Date, default:Date.now },
        lastEditedBy: { type:Schema.Types.ObjectId, ref:'User' },
        dateEdited: { type: Date, default:Date.now },
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