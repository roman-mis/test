'use strict';

/**
 * @ngdoc directive
 * @name origApp.directivese:origNi
 * @description
 * # origNi
 */
angular.module('origApp.directives')
    .directive('origNi', function () {        
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                scope.$watch(attrs.ngModel, function (n) {
                    if (!n) {
                        return;
                    }
                    var b = n.match(/^\s*([a-zA-Z]){2}(\s*[0-9]\s*){6}([a-zA-Z]){1}?$/);
                    var v = true;
                    if (!b) {
                        v = false;
                    }                    
                    c.$setValidity('ni', v);
                });
            }
        };
    });