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
    var d = new Date();
    var today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    angular.forEach(items, function(item) {
      if(item.status && item.status === 'delete'){
        return;
      }
      if( Date.parse(item.validTo) >= Date.parse(today)) {
        if(!reverse){
          filtered.push(item);
        }
      }else{
        if(reverse){
          filtered.push(item);
        }
      }
    });
    filtered.sort(function(a,b){
      return Date.parse(a.validFrom) - Date.parse(b.validFrom);
    });

    return filtered;
  };
})

 .filter('showEmptyRow', function() {
  return function(items) {
    var filtered = items;
    if (items.length === 0){
      filtered = [{amount:0}];
    }
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
