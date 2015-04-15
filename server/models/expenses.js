'use strict';

var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose,autoIncrement) {
    var schema = new BaseSchema({
        agency: { type: Schema.Types.ObjectId, ref:'Agency' },
        user: { type: Schema.Types.ObjectId, ref:'User' },
        // claimReference: String,
        startedDate: { type: Date, default: Date.now },
        submittedDate: { type: Date, default: Date.now },
        days: [{
            date: Date,
            startTime: String,
            endTime: String,
            hoursWorked: Number,
            postcodes: [ String ],
            source: String, //"wizard", "manual", "import"
            expenses: [{
                expenseType: String, // subsistence, travel, other, voucher
                subType: String, // breakfast, meal1, carvan, motorbike, stationery
                amount: Number, // 46 miles or 1 lunch
                value: Number, // Cost inc VAT for one item (45p for a mile or £4.50 for a lunch)
                vatApplicable: Number, // How much of the value (price per one) is to have VAT on it
                vatRate: Number, 
                vat: Number, // The VAT element (2.5p or 75p)
                total: Number, // The total, so 46 miles @ 45p = £20.70 or 1 lunch at £4.50 = £4.50
                text: String, // WE43 9KK
                description: String,
                receiptUrls: [ String ],
                status:{type:String,default:'submitted'}
            }]
        }]
    });
    schema.plugin(autoIncrement.plugin,{model:'Expense',field:'claimReference',startAt:1,incrementBy:1});

    return mongoose.model('Expense',schema);
};
