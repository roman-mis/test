//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
  	
	var consultantSchema=BaseSchema({
		first_name:       {type:String,required:false,trim:true},
    last_name:        {type:String,required:false,trim:true},
    email_address:    {type:String},
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
    branch_type:         {type:String},

		consultants:[consultantSchema]
	});


	var schema = BaseSchema({
		name: 				       {type:String},
		// agency_type: 		     {type:String},
		address1: 			     {type:String},
		address2: 			     {type:String},
		address3: 			     {type:String},
		town: 				       {type:String},
		country: 			       {type:String},
		postcode: 			     {type:String},
		company_reg_no: 	   {type:String},
		company_vat_no: 	   {type:String},
    logo_file_name:      {type:String},
		contact_information:{
			phone1: 			    {type:String},
  		phone2: 			    {type:String},
  		fax: 				      {type:String},
  		facebook: 			  {type:String},
  		linkedin: 			  {type:String},
      website:          {type:String},
  		email: 				    {type:String},
  		logo: 				    {type:String}
		},
    default_invoicing:{
      holiday_pay_included:       {type:Boolean},
      employers_ni_included:      {type:Boolean},
      invoice_vat_charged:        {type:Boolean},
      invoice_method:             {type:String},
      invoice_design:             {type:Schema.Types.ObjectId,ref:'Invoice_Design'},
      invoice_email_primary:      {type:String},
      invoice_email_secondary:    {type:String},
      payment_terms:              {type:String},
      invoice_to:                 {type:String}
    },
    default_payroll:{
      product_type:               {type:String},
      margin_charged_to_agency:   {type:Boolean},
      margin_type:                {type:String},
      margin_amount:              {type:Number},
      holiday_amount:             {type:Number}
    },
    sales:{
      lead_sales:                 {type:Schema.Types.ObjectId,ref:'User'},
      account_manager:            {type:Schema.Types.ObjectId,ref:'User'},
      commission_profile:         {type:Schema.Types.ObjectId,ref:'User'}
    },
    administration_cost:{
      per_referral:           {type:Number},
      per_timesheet:          {type:Number},
      timesheet_gross:        {type:Number}
    },
		branches:[branchSchema]
	},{});
	// mongoose.model('AgencyBranch',branchSchema);
  	return mongoose.model('Agency',schema);
}