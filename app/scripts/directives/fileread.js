'use strict';

angular.module('origApp.directives')
	.directive('fileread', [function () {
		return {
        scope: {
            fileread: '='
        },
			link: function (scope, element) {
				element.bind('change', function (changeEvent) {
					scope.$apply(function () {
						scope.fileread = changeEvent.target.files[0].name;
						// or all selected files:
						// scope.fileread = changeEvent.target.files;
					});
				});
			}
		};
	}]);