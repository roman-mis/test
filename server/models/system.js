'use strict';

// var validate=require('mongoose-validator');
// var Schema=require('mongoose').Schema;
var BaseSchema=require(__dirname+'/baseschema');

module.exports = function(mongoose) {
    var schema=new BaseSchema({
        companyProfile: {
            contact: {
                companyName: String,
                address1: String,
                address2: String,
                town: String,
                country: String,
                postcode: String,
                telephone: String,
                fax: String,
                email: String
            },
            accounts: {
                vatNumber: String,
                companyRegNo: String,
                utrNumber: String,
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
                accountNo: String,
                sortCode: String,
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
        ]
    });

    return mongoose.model('System',schema);
};
