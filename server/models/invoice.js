'use strict';

var Schema = require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var schema= new BaseSchema({
		agency: { type: Schema.Types.ObjectId, ref:'Agency' },
		branch: { type: Schema.Types.ObjectId, ref:'Branch' },
		invoices: [Number],
		conpanyDefaults:{
			holidayPayIncluded: Boolean,
			employeeNiIncluded: Boolean,
			vatCharged: Boolean,
			invoiceDesign: { type: Schema.Types.ObjectId, ref:'InvoiceDesign' },
			marginAmount: Number,
			invoiceEmailPrimary: String,
			invoiceEmailSecondary: String,
			paymentTerms: String,
			marginChargedToAgency: String,
			holidayAmount: String
		},
		totalNumberOfContractors: Number,
		erniValueToAgency: Number,
		holidayValueToAgency: Number,
		totalInvoiceValue: Number,
		totalVatValue: Number,
		marginValueToAgency: Number
	});
    
    return mongoose.model('Invoice',schema);
};