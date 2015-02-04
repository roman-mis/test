'use strict';

/**
 * @ngdoc filter
 * @name originemApp.filter:main
 * @description
 * # fromvaild
 */
angular.module('origApp.filters', [])
        .filter('formatDate', function() {
          return function(input, format) {
            format = format || 'DD/MM/YYYY HH:mm:ss';
            if (input === undefined) {
              return input;
            }
            return moment(input).format(format);
          };
        });
