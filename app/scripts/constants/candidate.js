'use strict';
/** define candidate schema */
angular.module('origApp.constants')
        .factory('candidate', function() {
            var details;
            // Public API here
            return {
                details : details,
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
