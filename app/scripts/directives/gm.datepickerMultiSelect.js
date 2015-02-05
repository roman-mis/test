'use strict';
/*
The MIT License (MIT)

Copyright (c) 2014 Gregory McGee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

angular.module('gm.datepickerMultiSelect', ['ui.bootstrap'])
  .config(function($provide) {
    $provide.decorator('daypickerDirective', function($delegate,$parse) {
      var directive = $delegate[0];

      /* Override compile */
      var link = directive.link;

      directive.compile = function() {
        return function(scope, element) {
          link.apply(this, arguments);
          var selectedDates = [];
          var alreadyUpdated;

          /* Called when multiSelect model is updated */
          scope.$on('update', function() {
            selectedDates=$parse(angular.element(element.parent()).attr('multi-select'))(scope.$parent.$parent) || [];
            update();
          });

          /* Get dates pushed into multiSelect array before Datepicker is ready */
          scope.$emit('requestSelectedDates');

          function update() {
            angular.forEach(scope.rows, function(row) {
              angular.forEach(row, function(day) {
                day.selected = selectedDates.indexOf(day.date.setHours(0, 0, 0, 0)) > -1;
              });
            });
            alreadyUpdated = true;
          }
        };
      };

      return $delegate;
    });
  })
  .directive('multiSelect', function() {
    return {
      require: ['datepicker', 'ngModel'],
      link: function(scope, elem, attrs) {
        var selectedDates;
        /* Called when directive is compiled */
        scope.$on('requestSelectedDates', function() {
          scope.$broadcast('update');
        });

        scope.$watchCollection(attrs.multiSelect, function(newVal) {
          selectedDates = newVal || [];
          scope.$broadcast('update');
        });

        scope.$watch(attrs.ngModel, function(newVal) {
          if(!newVal){
            return;
          }

          var dateVal = newVal.getTime();

          if(selectedDates.indexOf(dateVal) < 0) {
            selectedDates.push(dateVal);
          } else {
            selectedDates.splice(selectedDates.indexOf(dateVal), 1);
          }
        });
      }
    };
  });
