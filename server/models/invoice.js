'use strict';

var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose,autoIncrement) {
  	
	var schema= new BaseSchema({
		agency: { type: Schema.Types.ObjectId, ref:'Agency' },
		branch: { type: Schema.Types.ObjectId, ref:'Branch' },
        timesheetBatch: { type: Schema.Types.ObjectId, ref:'TimesheetBatch' },
		date: { type: Date, default: Date.now },
        invoiceNumber: Number,
        dueDate: Date,
        lines: [
            {
                worker: { type: Schema.Types.ObjectId, ref:'User' },
                lineType: String, // timesheet, margin
                elements: [
                    {
                        text: String,
                        weekEndingDate: Date,
                        units: Number,
                        rate: Number,
                        total: Number
                    }
                ]
            }
        ],
        companyDefaults:{
            holidayPayIncluded: Boolean,
            employersNiIncluded: Boolean,
            vatCharged: Boolean,
            invoiceDesign: { type: Schema.Types.ObjectId, ref:'InvoiceDesign' },
            marginAmount: Number,
            invoiceEmailPrimary: String,
            invoiceEmailSecondary: String,
            paymentTerms: String,
            marginChargedToAgency: Boolean,
            holidayPayDays: Number
        },
        net: Number,
        vatRate: Number,
        vat: Number,
        total: Number
	});
    
    schema.plugin(autoIncrement.plugin,{model:'Invoice',field:'invoiceNumber',startAt:1,incrementBy:1});
    
    return mongoose.model('Invoice',schema);
};