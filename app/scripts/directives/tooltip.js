'use strict';

/**
 * @ngdoc directive
 * @name origApp.directivese:origNi
 * @description
 * # origNi
 */
angular.module('origApp.directives')
        .directive('tooltip', function() {
            return {
                restrict: 'AE',
                link: function(scope, ele) {
                    angular.element(ele).tooltip();
                }
            };
        });