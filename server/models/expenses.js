var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose,autoIncrement) {
    var schema = BaseSchema({
        agency: { type: Schema.Types.ObjectId,ref:'Agency' },
        user: { type: Schema.Types.ObjectId,ref:'Agency' },
        claim_reference: String,
        started_date: { type: Date, default: Date.now },
        submitted_date: { type: Date, default: Date.now },
        days: [ {
            date: Date,
            start_time: String,
            end_time: String,
            expenses: [ {
                type: String, // subsistence, travel, other, voucher
                sub_type: String, // breakfast, meal1, carvan, motorbike, stationery
                value: Number,
                text: String, // WE43 9KK
                description: String,
                receipt_urls: String,
            } ]
        } ]
    })
}