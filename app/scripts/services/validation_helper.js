'use strict';

angular.module('origApp.services')
        .factory('ValidationHelper', function() {
          var _helper = {
            isValidPostCode: function(value) {
              var valid = true;
              if (angular.isDefined(value) && value.length > 0) {
                //valid = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/gi.test(value);
                valid = /^([A-Za-z]{1,2}[0-9]{1,2}[A-Za-z]?[ ]?)([0-9]{1}[A-Za-z]{2})$/gi.test(value);
              }
              return valid;
            }
          };

          return _helper;
        });