'use strict';

angular.module('origApp.services')
        .factory('ValidationHelper', function($filter) {
          var _helper = {
            isValidPostCode: function(value) {
              var valid = true;
              if (angular.isDefined(value) && value.length > 0) {
                valid = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/gi.test(value);
              }
              return valid;
            }
          };

          return _helper;
        });