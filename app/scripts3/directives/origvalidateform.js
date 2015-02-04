'use strict';

/**
 * @ngdoc directive
 * @name origApp.directivese:origValidateForm
 * @description
 * # origValidateForm
 */
angular.module('origApp.directives')
        .directive('origValidateForm', function() {
          return {
            require: 'form',
            restrict: 'AE',
            link: function(scope, element, attrs, ctrl) {
              ctrl.$elem = element;
              ctrl.$validate = function() {
                if (ctrl.$valid) {
                  return true;
                }
                for (var k in ctrl) {
                  if (k.indexOf('$') !== -1) {
                    continue;
                  }
                  ctrl[k].$dirty = true;
                  element.find('[name=' + k + ']').removeClass('ng-pristine').addClass('ng-dirty');
                }
                return false;
              };
            }
          };
        });