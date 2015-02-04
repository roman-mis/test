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
              ele.bind('change', function(){
                if(c.$invalid && !c.$error.unique){
                  return;
                }
                var newValue = ele.val();
                if (newValue) {
                  HttpResource.model('public').customGet('candidates/emailvalidation/' + newValue, {}, function(response) {
                    c.$setValidity('unique', response.data.result);
                  }, function() {

                  });
                }
              });
              scope.$watch(attrs.ngModel, function() {
                c.$setValidity('unique', true);
              });
            }
          };
        });