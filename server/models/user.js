'use strict';
//var utils=require('../utils/utils');
var validate=require('mongoose-validator');
var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');
 // var autoIncrement=require('mongoose-auto-increment');
 
module.exports = function(mongoose,autoIncrement) {
  var schema = new BaseSchema({
    title:              {type:String,required:false,trim:true},
    firstName:         {type:String,required:true,trim:true},
    lastName:          {type:String,required:true,trim:true},
    emailAddress:      {
        type:String,required:true,
        validate:[validate({
            validator:'isEmail',message:'Please enter valid email address'
        })],
        trim:true,lowercase:true,unique:true
      },
    password:           {type:String},
    userType:          {type:String,required:true},
    activationCode:    {type:String},
    isActive:          {type:Boolean,default:false},
    locked:          {type:Boolean,default:false},
    lockedUnlockedOn:      {type:Date,default:Date.now},
    lockedUnlockedBy:      {type:Schema.Types.ObjectId,ref:'User'},
    activatedDate:     {type:Date,required:false},
    avatarFileName:   {type:String,default:''},
    lastLogin:{type:String,default:'none'},
    worker:{
        contactNumber:      {type:String,required:false,trim:true},
        birthDate:          {type:Date,required:false},
        address1:           {type:String,required:false,trim:true},
        address2:           {type:String,trim:false},
        address3:           {type:String,trim:false},
        town:                {type:String,required:false,trim:true},
        county:              {type:String,required:false,trim:true},
        postCode:           {type:String,required:false,trim:true},    
        gender:              {type:String,required:false,trim:true,uppercase:true,enum:['M','F']},
        nationality:         {type:String,required:false,trim:true},    
        arrivalDate:        {type:Date,required:false},
        recentDepDate:     {type:Date,required:false},
        empLastVisit:      {type:Boolean,required:false},
        agencyName:         {type:String,required:false,trim:true},
        sector:             {type:String},
        jobTitle:           {type:String,required:false,trim:true},
        startDate:          {type:Date,required:false},
        vehicleInformation: [{
            vehicleCode:    {type:String,required:false,trim:true},
            fuelType:       {type:String,required:false,trim:true},
            engineSize:     {type:String,required:false,trim:true},
            make:           {type:String,required:false,trim:true},
            registration:   {type:String,required:false,trim:true},
            companyCar:     {type:Boolean,required:false}
        }],
        bankDetail:{
            bankName:           {type:String,required:false,trim:true},
            accountName:        {type:String,required:false,trim:true},
            sortCode:           {type:String,required:false,trim:true},
            accountNo:          {type:String,required:false,trim:true},
            bankRollNo:        {type:String,required:false}
        },
        taxDetail:{
            niNumber:           {type:String,required:false,trim:true},
            currentP45:         {type:Boolean,required:false},
            p45Uploaded:        {type:Boolean,required:false},
            p46Uploaded:        {type:Boolean,required:false},
            p45DocumentUrl:     {type:String,required:false},
            employeesNIpaid:    {type:Boolean,required:false,default:true}
        },
        payrollTax:{
            declaration:                 {type:String,trim:true},
            p45GrossTax:               {type:Number},
            p45TaxDeducted:            {type:Number},
            payFrequency:               {type:String},
            taxCode:                    {type:String},
            taxBasis:                   {type:String}
        },
        payrollProduct:[{
            agency:                   {type:Schema.Types.ObjectId,ref:'Agency'},
            branch:                   {type:Schema.Types.ObjectId,ref:'Branch'},
            consultant:               {type:Schema.Types.ObjectId,ref:'Consultant'},
            agencyRef:                  {type:String},
            margin:                      {type:String},
            marginFixed:                {type:Number},
            holidayPayRule:            {type:String},
            holidayPayDays:             {type:String},
            derogationContract:         {type:String},
            derogationSpread:           {type:String},
            serviceUsed:                {type:String},
            paymentTerms:               {type:String},
            paymentMethod:              {type:String},
            jobDescription:             {type:String},
            marginException: [{
                marginType:                        {type:String},
                reason:                             {type:String},
                deductionType:                     {type:String},
                deductionDate:                     {type:Date},
                deductionPeriod:                   {type:String},
                deductionNumberOfPayroll:        {type:Number},
                createdBy:                         {type:Schema.Types.ObjectId,ref:'User'},
                createdDate:                       {type:Date}
            }],
            createdDate:                {type:Date},
            updatedDate:                {type:Date}
        }],
        expensesMileageYtd: Number,
        currentExpensesToUse: Number,
        unpaidExpenses: [
            { 
                agency: { type: Schema.Types.ObjectId,ref:'Agency' },
                claimReference: String,
                startedDate: { type: Date, default: Date.now },
                submittedDate: { type: Date, default: Date.now },
                days: [ {
                    date: Date,
                    startTime: String,
                    endTime: String,
                    expenses: [ {
                        type: String, // subsistence, travel, other, voucher
                        subType: String, // breakfast, meal1, carvan, motorbike, stationery
                        value: Number,
                        text: String, // WE43 9KK
                        description: String,
                        isRoundTrip: Boolean,
                        receiptUrls: [ String ],
                    } ]
                } ]
            }                
        ],
        payrollValues: {
            holidayPayRetained: Number
        }
      },
        documents:[{
            
            agency:{type:Schema.Types.ObjectId,ref:'Agency'},
            documentType:String,
            documentName:String,
            generatedName:String,
            mimeType:String,
            uploadedBy:{type:Schema.Types.ObjectId,ref:'User'},
            uploadedDate:Date
            }
        ],
      
        contactDetail:{
            phone:               {type:String,required:false},
            mobile:              {type:String,required:false},
            altEmail:           {type:String,required:false},
            facebook:            {type:String,required:false},
            linkedin:            {type:String,required:false},
            google:              {type:String,required:false}
        },
      dpaUpdatedDate:{type:Date,default:Date.now},
      dpaUpdatedBy:{type:Schema.Types.ObjectId,ref:'User'},
      expensesBalance: Number,
       /* branchId:{type:Schema.Types.ObjectId,ref:'Agency.branches'}*/
},{skipCreatedDate:false/*default false*/,skipUpdatedDate:false/*default false*/,skipUpdatedBy:false/*default false*/});
schema.plugin(autoIncrement.plugin,{model:'User',field:'candidateNo',startAt:1,incrementBy:1});
    schema.pre('save',function(next){
        if(this.worker.taxDetail.employeesNIpaid===undefined){
            this.worker.taxDetail.employeesNIpaid=true;
        }
       //  console.log('user saving heheheheee');
       //  // console.log(this);
       //  console.log(this.worker.taxDetail.currentP45===undefined);
       // console.log(this.worker.taxDetail.currentP45===null);
       // console.log(this.worker.taxDetail.employeesNIpaid===undefined);
       // console.log(this.worker.taxDetail.employeesNIpaid===null);
       next();
         
    });

  return mongoose.model('User',schema);

};
