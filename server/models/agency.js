'use strict';
//var utils=require('../utils/utils');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose,autoIncrement) {
  	
	var schema = new BaseSchema({
		name: 				       {type:String},
		// agencyType: 		     {type:String},
		address1: 			     {type:String},
		address2: 			     {type:String},
		address3: 			     {type:String},
		town: 				       {type:String},
		country: 			       {type:String},
		postCode: 			     {type:String},
		companyRegNo: 	   {type:String},
		companyVatNo: 	   {type:String},
    logoFileName:      {type:String},
    status:            {type:String},
		contactInformation:{
			phone1: 			    {type:String},
  		phone2: 			    {type:String},
  		fax: 				      {type:String},
  		facebook: 			  {type:String},
  		linkedin: 			  {type:String},
      website:          {type:String},
  		email: 				    {type:String},
  		logo: 				    {type:String}
		},
    defaultInvoicing:{
      holidayPayIncluded:       {type:Boolean},
      employersNiIncluded:      {type:Boolean},
      invoiceVatCharged:        {type:Boolean},
      invoiceMethod:             {type:String},
      invoiceDesign:             {type:Schema.Types.ObjectId,ref:'InvoiceDesign'},
      invoiceEmailPrimary:      {type:String},
      invoiceEmailSecondary:    {type:String},
      paymentTerms:              {type:String},
      invoiceTo:                 {type:Schema.Types.ObjectId,ref:'Branch'}
    },
    defaultPayroll:{
      productType:               {type:String},
      marginChargedToAgency:   {type:Boolean},
      marginType:                {type:String},
      marginAmount:              {type:Number},
      holidayAmount:             {type:Number}
    },
    sales:{
      leadSales:                 {type:Schema.Types.ObjectId,ref:'User'},
      accountManager:            {type:Schema.Types.ObjectId,ref:'User'},
      commissionProfile:         {type:Schema.Types.ObjectId,ref:'User'}
    },
    administrationCost:{
      perReferral:           {type:Number},
      perTimesheet:          {type:Number},
      timesheetGross:        {type:Number}
    },
		branches:[{type:Schema.Types.ObjectId,ref:'Branch'}],
    marginFee:{
      
        margin:{
              fixedFee:Number,
              marginType:String,
              percentageOfTimesheets:{
                minAmount:Number,
                maxAmount:Number,
                ranges:[
                  {
                    from:Number,
                    to:Number,
                    charged:Number
                  }
                
                ]
              },
              totalHours:{
                minAmount:Number,
                maxAmount:Number,
                ranges:[
                  {
                    from:Number,
                    to:Number,
                    charged:Number
                  }
                
                ]
              },
              fixedOnTimesheets:Number


            }
      }
    
	},{

  });
    schema.plugin(autoIncrement.plugin,{model:'User',field:'agencyNo',startAt:1,incrementBy:1});
	// mongoose.model('AgencyBranch',branchSchema);
  	return mongoose.model('Agency',schema);
};
