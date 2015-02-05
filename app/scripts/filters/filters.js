'use strict';

/**
 * @ngdoc filter
 * @name originemApp.filter:main
 * @description
 * # fromvaild
 */
angular.module('origApp.filters', [])
        .filter('capitalize', function() {
          return function(input) {
            // input will be the string we pass in
            if (input){
              return input[0].toUpperCase() + input.slice(1);
            }
          };
        })
        .filter('formatDate', function() {
          return function(input, format) {
            format = format || 'DD/MM/YYYY HH:mm:ss';
            if (input === undefined) {
              return input;
            }
            return moment(input).format(format);
          };
        })
        .filter('formatNumber', function($filter) {
          function doFilter(input) {
            if (input === null) {
              return '';
            }
            var num = (input >= 0) ? $filter('number')(input, 2) : '(' + $filter('number')(Math.abs(input), 2) + ')';
            num = (num === '()' ? '0.00' : num);
            var parts = num.split('.');
            return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
          }
          return function(input, fields) {
            if (input === undefined) {
              return input;
            }
            if (fields && typeof fields === 'object') {
              _.each(input, function(inp) {
                _.each(fields, function(field) {
                  inp[field] = doFilter(inp[field]);
                });
              });
            }
            else if (fields && typeof fields === 'string') {
              _.each(input, function(inp) {
                inp[fields] = doFilter(inp[fields]);
              });
            }
            else {
              input = doFilter(input);
            }
            return input;
          };
        })
        .filter('rowsSum', function() {
          return function(input, field) {
            if (input === undefined) {
              return input;
            }
            var sum = 0;
            _.each(input, function(inp) {
              sum += inp[field] || 0;
            });
            return sum;
          };
        });
