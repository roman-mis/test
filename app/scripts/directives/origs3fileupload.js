'use strict';

/**
 * @ngdoc directive
 * @name mspApp.directive:datePicker
 * @description
 * # datePicker
 */

angular.module('origApp.directives')
        .directive('origS3Fileupload', function(s3Service) {
          return {
            restrict: 'AE',
            scope: {
              ngModel: '=',
              placeholder: '@',
              datepickerPopup: '@'
            },
            templateUrl: 'views/partials/origs3fileupload.html',
            replace: true,
            link: function(scope) {
              scope.ngModel = scope.ngModel || {};
              scope.fileNameChanged = function(element) {
                var fileName = element.files[0].name;
                //scope.$apply();
                s3Service.upload({
                  'fileName': new Date().getTime().toString() + element.files[0].name,
                  'file': element.files[0]
                }).then(function(data) {
                  scope.ngModel.url = data.url;
                  scope.ngModel.name = fileName;
                }, function() {
                  console.log('error');
                });
              };
            }
          };
        });