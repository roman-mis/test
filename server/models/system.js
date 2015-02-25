'use strict';

// var validate=require('mongoose-validator');
// var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema = new BaseSchema({
        companyProfile: {
            contact: {
                companyName: String,
                address1: String,
                address2: String,
                town: String,
                country: String,
                postcode: String,
                telephone: Number,
                fax: Number,
                email: String
            },
            accounts: {
                vatNumber: Number,
                companyRegNo: Number,
                utrNumber: Number,
                taxDistrictNo: String,
                payeRef: String,
                accountsOfficeRef: String
            },
            bankDetails: {
                bankName: String,
                address1: String,
                address2: String,
                town: String,
                county: String,
                country: String,
                postcode: String,
                accountName: String,
                accountNo: Number,
                sortCode: Number,
                payrollRef: String
            },
            defaults: {
                payFrequency: String,
                holidayPayRule: String,
                paymentMethod: String,
                adminFee: String,
                derogationContract: String,
                derogationSpreadWeeks: Number,
                communicationMethod: String,
                contractorStatus: String,
                taxCodeContractors: String
            }
        },
        rti: {
        },
        mileageRates: {
        },
        cis: {
        },
        statutoryTables: {
            vat:[{
                amount: Number,
                validFrom: Date,
                validTo: Date
            }],
            nmw: [{
                ageLower: Number,
                ageUpper: Number,
                amount: Number,
                validFrom: Date,
                validTo: Date
            }],
            employersNiThreshold: [
                {
                    amount: Number,
                    validFrom: Date,
                    validTo: Date
                }
            ],
            employersNiRate: [
                {
                    amount: Number,
                    validFrom: Date,
                    validTo: Date
                }
            ],
            employeesNiRate: [
                {
                    lowerThreshold: Number,
                    upperThreshold: Number,
                    amount: Number,
                    validFrom: Date,
                    validTo: Date
                }
            ],
            employeesHighEarnerNiRate: [
                {
                    lowerThreshold: Number,
                    amount: Number,
                    validFrom: Date,
                    validTo: Date
                }
            ],
            incomeTaxHigherRateThreshold: [
                 {
                    amount: Number,
                    validFrom: Date,
                    validTo: Date
                }
            ],
            incomeTaxAdditionalRateThreshold: [
                 {
                    amount: Number,
                    validFrom: Date,
                    validTo: Date
                }
            ],
            incomeTaxBasicRate: [
                 {
                    amount: Number,
                    validFrom: Date,
                    validTo: Date
                }
            ],
            incomeTaxHigherRate: [
                 {
                    amount: Number,
                    validFrom: Date,
                    validTo: Date
                }
            ],
            incomeTaxAdditionalRate: [
                {
                    amount: Number,
                    validFrom: Date,
                    validTo: Date
                }
            ],
            workPatterns: [
                {
                    monday: Boolean,
                    tuesday: Boolean,
                    wednesday: Boolean,
                    thursday: Boolean,
                    friday: Boolean,
                    saturday: Boolean,
                    sunday: Boolean,
                    validFrom: Date,
                    validTo: Date
                }
            ]
        },
        paymentRates: [
            {
                name: String,
                rateType: String,
                hours: Number,
                importAliases: [ String ]
            }
        ],
        expensesRate:[
            {
                name:String,
                amount:Number,
                taxApplicable:Boolean,
                expensesRateType:String,
                vat:Boolean,
                dispensation:Boolean,
                receipted:Boolean,
                isEnabled:Boolean,
                type: String // subsistence, other
            }
        ]
    });

    return mongoose.model('System', schema);
};

