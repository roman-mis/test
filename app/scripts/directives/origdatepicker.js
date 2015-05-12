'use strict';

/**
 * @ngdoc directive
 * @name mspApp.directive:datePicker
 * @description
 * # datePicker
 */

angular.module('origApp.directives')
        .directive('origDatepicker', function() {
            return {
                restrict: 'AE',
                scope: {
                    ngModel: '=',
                    placeholder: '@',
                    dateFormat: '@',
					dateDisabled: '&'
                },
                templateUrl: 'views/partials/origdatepicker.html',
                replace: true,
                link: function(scope, element, attrs) {
                    scope.dateOptions = {
                        minDate: new Date(2014, 11, 1),
                        maxDate: new Date(2015, 1, 28),
                        initDate: new Date(2015, 0, 9)
                    };
                    scope.initDate =new Date('01-01-1900');
                    scope.firstDate = Date.parse(new Date(2014,8,5));
					scope.dateDisabled = function(date, mode) {
						var disabledFunc = attrs.dateDisabled ? attrs.dateDisabled.split('(')[0] : void 0;
						if ((disabledFunc !== void 0) && (typeof scope.$parent[disabledFunc] === 'function')) {
							return scope.$parent[disabledFunc](date, mode);
						} else {
							return null;	
						}						
					};
                   return true;
                }               
            };
        });
		