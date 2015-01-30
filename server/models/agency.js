//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var consultantSchema=BaseSchema({
		firstName:       {type:String,required:false,trim:true},
    lastName:        {type:String,required:false,trim:true},
    emailAddress:    {type:String},
    phone:            {type:String},
    role:             {type:String},
    status:           {type:String},
    user:             {type:Schema.Types.ObjectId,ref:'User'}
	})

	var branchSchema=BaseSchema({
		name:{type:String,required:true},
    address1:            {type:String},
    address2:            {type:String},
    address3:            {type:String},
		town:                {type:String},
    postcode:            {type:String},
    branchType:         {type:String},

		consultants:[consultantSchema]
	});


	var schema = BaseSchema({
		name: 				       {type:String},
		// agencyType: 		     {type:String},
		address1: 			     {type:String},
		address2: 			     {type:String},
		address3: 			     {type:String},
		town: 				       {type:String},
		country: 			       {type:String},
		postcode: 			     {type:String},
		companyRegNo: 	   {type:String},
		companyVatNo: 	   {type:String},
    logoFileName:      {type:String},
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
      invoiceDesign:             {type:Schema.Types.ObjectId,ref:'Invoice_Design'},
      invoiceEmailPrimary:      {type:String},
      invoiceEmailSecondary:    {type:String},
      paymentTerms:              {type:String},
      invoiceTo:                 {type:Schema.Types.ObjectId,ref:'Agency.branches'}
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
		branches:[branchSchema]
	},{});
	// mongoose.model('AgencyBranch',branchSchema);
  	return mongoose.model('Agency',schema);
}