'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	

	var schema= new BaseSchema({
        type: String, // ssp, smp, spp, holidayPay, studentLoan
        status: String, // Submitted, 
		worker: { type:Schema.Types.ObjectId, ref:'User' },
        dateInformed: Date,
        intendedStartDate: Date,
        startDate: Date,
        endDate: Date,
        smp: {
            babyDueDate: Date,
        },
        spp: {
            babyDueDate: Date,
            relationship: String,
            numberWeeks: Number
        },
        holidayPay: {
            amount: Number
        },
        studentLoan: {
            haveLoan: Boolean,
            payDirectly: Boolean
        },
        imageUrl: String,
        days: [
               { weekNumber: Number,
                               monthNumber: Number,
                               amount: Number}
        ]
        
	});


  	return mongoose.model('ActionRequest',schema);
};
