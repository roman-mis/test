'use strict';

/**
 * @ngdoc directive
 * @name mspApp.directive:datePicker
 * @description
 * # datePicker
 */

angular.module('origApp.directives')
        .directive('orgWidget', function() {
            return {
                restrict: 'AE',
                scope: {
                   src: '@widgetSrc',
                   title:'@widgetTitle',
                   controller:'@'
                },
                templateUrl: 'views/partials/origwidget.html',
                replace: true,
                link: function($scope, ele, attrs, c) {
                   return true;
                }
            };
        });