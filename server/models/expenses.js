var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose,autoIncrement) {
    var schema = BaseSchema({
        agency: { type: Schema.Types.ObjectId,ref:'Agency' },
        user: { type: Schema.Types.ObjectId,ref:'Agency' },
        claimReference: String,
        startedDate: { type: Date, default: Date.now },
        submittedDate: { type: Date, default: Date.now },
        days: [ {
            date: Date,
            startTime: String,
            endTime: String,
            expenses: [ {
                type: String, // subsistence, travel, other, voucher
                subType: String, // breakfast, meal1, carvan, motorbike, stationery
                value: Number,
                text: String, // WE43 9KK
                description: String,
                receiptUrls: String,
            } ]
        } ]
    })
}