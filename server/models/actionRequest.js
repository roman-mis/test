'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose,autoIncrement) {


	var schema= new BaseSchema({
        type: String, // ssp, smp, spp, holidaypay, studentloan
        status: String, 
		    worker: { type:Schema.Types.ObjectId, ref:'User' },
        dateInformed: Date,
        intendedStartDate: Date,
        actualStartDate: Date,
        startDate: Date,
        endDate: Date,
        smp: {
            babyDueDate: Date,
            actualBirthDate: Date,
            babyEarly: Boolean
        },
        spp: {
            babyDueDate: Date,
            relationship: String,
            numberWeeks: Number,
            actualBirthDate: Date
        },
        holidayPay: {
            amount: Number
        },
        studentLoan: {
            haveLoan: Boolean,
            payDirectly: Boolean
        },
        p45: {
            dateRequested: Date,
            leavingDate: Date
        },
        imageUrl: String,
        periods: [
            {
                weekNumber: Number,
                monthNumber: Number,
                amountPaid: Number,
                amount: Number,
                year:Number,
                paid: Boolean
            }
        ]

	});

    schema.plugin(autoIncrement.plugin,{model:'ActionRequest',field:'requestReference',startAt:1,incrementBy:1});


  	return mongoose.model('ActionRequest',schema);
};
