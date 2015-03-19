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
            expenses: [{
                expenseType: String, // subsistence, travel, other, voucher
                subType: String, // breakfast, meal1, carvan, motorbike, stationery
                value: Number,
                mileage: Number,
                text: String, // WE43 9KK
                description: String,
                receiptUrls: [ String ]
            }]
        }]
    });
    schema.plugin(autoIncrement.plugin,{model:'Expense',field:'claimReference',startAt:1,incrementBy:1});

    return mongoose.model('Expense',schema);
};