'use strict';

/**
 * @ngdoc directive
 * @name origApp.directivese:match
 * @description
 * # match
 */
angular.module('origApp.directives')      
    .directive('orgMatch', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                match: '=orgMatch'
            },
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(function() {
                    var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                    return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.match === modelValue;
                }, function(currentValue) {
                    ctrl.$setValidity('match', currentValue);
                });
            }
        };
    });
