'use strict';

angular.module('origApp.directives')
.directive('roundNumber',['$filter','$parse','$locale',function($filter,$parse,$locale){


  return {

    require:'ngModel',
    link: function (scope, element, attrs, ngModel) {

            if (!ngModel)
                return;
            var formats = $locale.NUMBER_FORMATS;


            var fixNumber = function (number) {
                if (number) {
                    if (typeof number !== 'number') {
                        number = number.replace(',', '');
                        number = parseFloat(number);
                    }
                }
                return number;
            }

            // function to do the rounding
            var roundMe = function (number) {
                number = fixNumber(number);
                if (number) {
                    return $filter('number')(number, 2);
                }
            }

            // Listen for change events to enable binding
            element.bind('blur', function () {
                element.val(roundMe(ngModel.$modelValue));
            });

            // push a formatter so the model knows how to render
            ngModel.$formatters.push(function (value) {
                if (value) {
                    return roundMe(value);
                }
            });

            // push a parser to remove any special rendering and make sure the inputted number is rounded
            ngModel.$parsers.push(function (value) {
                return value;
            });
        }
}


}])
