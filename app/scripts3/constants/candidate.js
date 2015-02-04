'use strict';
/** define candidate schema */
angular.module('origApp.constants')
        .factory('candidate', function() {
            // Public API here
            var candidate = {
                details : {},
                getAttribute: function(key) {
                    return candidate.details[key];
                },
                getAttributes: function() {
                    return candidate.details;
                },
                setAttribute: function(key, value) {
                    candidate.details[key] = value;
                    return true;
                },
                setAttributes: function(info) {
                    candidate.details = angular.extend(candidate.details, info);
                    return true;
                }
            };
            return candidate;
        });
