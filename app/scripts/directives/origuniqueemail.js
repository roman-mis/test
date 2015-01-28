'use strict';

/**
 * @ngdoc directive
 * @name origApp.directivese:origValidateForm
 * @description
 * # origValidateForm
 */
angular.module('origApp.directives')
        .directive('origUniqueEmail', function(HttpResource) {
          return {
            restrict: 'AE',
            require: 'ngModel',
            link: function(scope, ele, attrs, c) {
              scope.$watch(attrs.ngModel, function(newValue) {
                if(c.$invalid){
                  return;
                }
                if (!newValue) {
                  c.$setValidity('unique', true);
                  return true;
                } else {
                  HttpResource.model("public").customGet('candidates/emailvalidation/' + newValue, {}, function(response) {
                    c.$setValidity('unique', response.data.result);
                  }, function(response) {

                  });
                }
              });
            }
          };
        });