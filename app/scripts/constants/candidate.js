'use strict';
/** define candidate schema */
angular.module('origApp.constants')
        .factory('candidate', function() {
            var candidate = {
                title: '',
                firstName: '',
                lastName: '',
                emailAddress: '',
                contactNumber: '',
                niNumber: '',
                dateOfBirthday: '',
                address1: '',
                address2: '',
                address3: '',
                town: '',
                county: '',
                postCode: '',
                gender: '',
                nationality: '',
                entranceDate: '',
                recentEntranceDate: '',
                payEmployFlag: '',
                agencyName: '',
                jobTitle: '',
                sector: '',
                jobStartDate: '',
                bankName: '',
                accountName: '',
                sortCode: '',
                accountNumber: '',
                bankRollNumber: '',
                haveP45Document: '',
                p45Document: '',
                p45Uploaded: '',
                p46Complted: ''
            };
            // Public API here
            return {
                getAttribute: function(key) {
                    return candidate[key];
                },
                getAttributes: function() {
                    return candidate;
                },
                setAttribute: function(key, value) {
                    candidate[key] = value;
                    return true;
                },
                setAttributes: function(info) {
                    candidate = angular.extend(candidate, info);
                    return true;
                }
            };
        });
