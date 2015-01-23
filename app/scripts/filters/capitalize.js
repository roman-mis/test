'use strict';

/**
 * @ngdoc filter
 * @name origApp.filters:capitalize
 * @description
 * # capitalize
 */


angular.module('origApp.filters')
	.filter( 'capitalize' , function() {
		return function(input) {
			// input will be the string we pass in
			if (input)
				return input[0].toUpperCase() + input.slice( 1 );
		}
	});