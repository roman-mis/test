'use strict';

/**
 * @ngdoc directive
 * @name origApp.directivese:origPostcode
 * @description
 * # origPostcode
 */
angular.module('origApp.directives')
	.directive('origPostcode', function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ngModel) {

				//For DOM -> model validation
				ngModel.$parsers.unshift(function (value) {
					return validate(value);
				});

				//For model -> DOM validation
				ngModel.$formatters.unshift(function (value) {
					return validate(value);
				});

				function validate(value) {
					var valid = true;
					if (angular.isDefined(value) && value.length > 0) {						
						valid =  /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/gi.test(value);
					}
					ngModel.$setValidity('postcode', valid);
					return value;
				}
			}
		};
	});
