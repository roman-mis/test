'use strict';
angular.module('origApp.directives')
.directive('ngKeydown', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            console.log('key pressed')
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});