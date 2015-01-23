//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');
 // var autoIncrement=require('mongoose-auto-increment');
 
module.exports = function(mongoose,autoIncrement) {
  var schema = BaseSchema({
    title:              {type:String,required:false,trim:true},
    first_name:         {type:String,required:true,trim:true},
    last_name:          {type:String,required:true,trim:true},
    email_address:      {
        type:String,required:true,
        validate:[validate({
            validator:'isEmail',message:'Please enter valid email address'
        })],
        trim:true,lowercase:true,unique:true
      },
    password:           {type:String},
    user_type:          {type:String,required:true},
    activation_code:    {type:String},
    is_active:          {type:Boolean,default:false},
    locked:          {type:Boolean,default:false},
    locked_unlocked_on:      {type:Date,default:Date.now},
    locked_unlocked_by:      {type:Schema.Types.ObjectId,ref:'User'},
    activated_date:     {type:Date,required:false},
    avatar_file_name:   {type:String,default:''},
    worker:{
        contact_number:      {type:String,required:false,trim:true},
        birth_date:          {type:Date,required:false},
        address_1:           {type:String,required:false,trim:true},
        address_2:           {type:String,trim:false},
        address_3:           {type:String,trim:false},
        town:                {type:String,required:false,trim:true},
        county:              {type:String,required:false,trim:true},
        post_code:           {type:String,required:false,trim:true},    
        gender:              {type:String,required:false,trim:true,uppercase:true,enum:['M','F']},
        nationality:         {type:String,required:false,trim:true},    
        arrival_date:        {type:Date,required:false},
        recent_dep_date:     {type:Date,required:false},
        emp_last_visit:      {type:Boolean,required:false},
        agency_name:         {type:String,required:false,trim:true},
        job_title:           {type:String,required:false,trim:true},
        start_date:          {type:Date,required:false},
        bank_detail:{
            bank_name:           {type:String,required:false,trim:true},
            account_name:        {type:String,required:false,trim:true},
            sort_code:           {type:String,required:false,trim:true},
            account_no:          {type:String,required:false,trim:true},
            bank_roll_no:        {type:String,required:false}
        },
        contact_detail:{
            phone:               {type:String,required:false},
            mobile:              {type:String,required:false},
            alt_email:           {type:String,required:false},
            facebook:            {type:String,required:false},
            linkedin:            {type:String,required:false},
            google:              {type:String,required:false}
        },
        tax_detail:{
            ni_number:           {type:String,required:false,trim:true},
            current_p45:         {type:Boolean,required:false},
            p45_uploaded:        {type:Boolean,required:false},
            p46_uploaded:        {type:Boolean,required:false},
            p45_document_url:    {type:String,required:false}
        },
        payroll_tax:{
            declaration:                 {type:String,trim:true},
            p45_gross_tax:               {type:Number},
            p45_tax_deducted:            {type:Number},
            pay_frequency:               {type:String},
            tax_code:                    {type:String},
            tax_basis:                   {type:String}
        },
        payroll_product:[{
            agency_id:                   {type:Schema.Types.ObjectId,ref:'Agency'},
            branch_id:                   {type:Schema.Types.ObjectId,ref:'Agency.branches'},
            consultant_id:               {type:Schema.Types.ObjectId,ref:'Agency.branches.consultants'},
            agency_ref:                  {type:String},
            margin:                      {type:String},
            margin_fixed:                {type:Number},
            holiday_pay_rule:            {type:String},
            derogation_contract:         {type:String},
            derogation_spread:           {type:String},
            service_used:                {type:String},
            payment_terms:               {type:String},
            payment_method:              {type:String},
            job_description:             {type:String},
            margin_exception: [{
                margin_type:                        {type:String},
                reason:                             {type:String},
                deduction_type:                     {type:String},
                deduction_date:                     {type:Date},
                deduction_period:                   {type:String},
                deduction_number_of_payroll:        {type:Number},
                created_by:                         {type:Schema.Types.ObjectId,ref:'User'},
                created_date:                       {type:Date}
            }],
            created_date:                {type:Date},
            updated_date:                {type:Date}
        }],
        expenses_mileage_ytd: Number,
        unpaid_expenses: [
            { 
                agency_id: { type: Schema.Types.ObjectId,ref:'Agency' },
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
                        is_round_trip: Boolean,
                        receipt_urls: [ String ],
                    } ]
                } ]
            }                
        ]
      },
        documents:[{
            
            agency:{type:Schema.Types.ObjectId,ref:'Agency'},
            document_type:String,
            document_name:String,
            generated_name:String,
            mime_type:String,
            uploaded_by:{type:Schema.Types.ObjectId,ref:'User'},
            uploaded_date:Date
            }
        ],
      
        contact_detail:{
            phone:               {type:String,required:false},
            mobile:              {type:String,required:false},
            alt_email:           {type:String,required:false},
            facebook:            {type:String,required:false},
            linkedin:            {type:String,required:false},
            google:              {type:String,required:false}
        },
      dpa_updated_date:{type:Date,default:Date.now},
      dpa_updated_by:{type:Schema.Types.ObjectId,ref:'User'}
       /* branch_id:{type:Schema.Types.ObjectId,ref:'Agency.branches'}*/
},{skipCreatedDate:false/*default false*/,skipUpdatedDate:false/*default false*/,skipUpdatedBy:false/*default false*/});
schema.plugin(autoIncrement.plugin,{model:'User',field:'candidate_no',startAt:1,incrementBy:1});

  return mongoose.model('User',schema);

}
