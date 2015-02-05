'use strict';

/**
 * @ngdoc directive
 * @name origApp.directivese:origPostcode
 * @description
 * # origPostcode
 */
angular.module('origApp.directives')
	.directive('origPostcode', function (ValidationHelper) {
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
					ngModel.$setValidity('postcode', ValidationHelper.isValidPostCode(value));
					return value;
				}
			}
		};
	});
