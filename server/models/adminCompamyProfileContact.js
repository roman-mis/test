'use strict';
//var utils=require('../utils/utils');
var Schema = require('mongoose').Schema;
var BaseSchema = require(__dirname+'/baseschema');

module.exports = function(mongoose) {

	var schema = new BaseSchema({
		companyName: 		{type:String},
		address1: 		    {type:String},
		address2: 			{type:String},
		town: 			    {type:String},
		country: 			{type:String},
		postCode:			{type:String},
		tel:				{type:Number},
		fax:				{type:Number},
		email:				{type:String}
	},{
		skipUpdatedBy: true
	});
	return mongoose.model('adminCompanyProfileContact', schema);
}