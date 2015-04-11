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
 .filter('capitalizeAll', function() {
  return function(input) {
            // input will be the string we pass in
            if (input){
              return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
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
 .filter('formatDateOnly', function() {
  return function(input, format) {
    format = format || 'DD/MM/YYYY';
    if (input === undefined) {
      return input;
    }
    return moment(input).format(format);
  };
})
 .filter('validDate', function() {
  return function(items, reverse) {
    var filtered = [];
    var today = new Date();
    angular.forEach(items, function(item) {
      var dateFrom = new Date(item.validFrom);
      var dateTo = new Date(item.validTo);
      if(!reverse){
        if(dateFrom.getTime() <= today.getTime() && dateTo.getTime() >= today.getTime()) {
          filtered.push(item);
        }
      } else {
        if(dateTo.getTime() < today.getTime()) {
          filtered.push(item);
        }
      }
    });
    return filtered;
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
      sum += isNaN(inp[field]*1) ? 0 : inp[field]*1;
    });
    return sum;
  };
});
