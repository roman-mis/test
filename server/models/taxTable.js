'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	

	var schema= new BaseSchema({
        periodType: String, // weekly, twoWeekly, fourWeekly, monthly
        weekNumber: Number,
        monthNumber: Number,
        description: String,
        startDate: Date        
	});


  	return mongoose.model('TaxTable',schema);
};
