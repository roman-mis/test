'use strict';

angular.module('origApp.directives')
        .directive('templateGrid', function() {
          return {
            restrict: 'A',
            scope: {
              options: '=templateGrid',
              externalScope: '='
            },
            controller: function($scope) {
              var defaultOptions = {
                limit: 20,
                maxVisiblePages: 5
              };
              console.log($scope.options);
              console.log($scope.options.getImage("task"));
              $scope.img = $scope.options.columns.splice(0,1)[0];

              for(var k in defaultOptions){
                $scope.options[k] = defaultOptions[k];
              }



              // $scope.$watch('options.limit', function(nValue, oValue) {
              //   if (nValue !== oValue && $scope.options.onLimitChanged) {
              //     $scope.options.onLimitChanged(nValue);
              //   }
              // });

              // $scope.$watch('options.currentPage', function(nValue, oValue) {
              //   if (nValue !== oValue && $scope.options.onPageChanged) {
              //     $scope.options.onPageChanged(nValue);
              //   }
              // });
            },
            templateUrl: 'views/partials/templateGrid.html',
            replace: true,
            link: function() {
              return true;
            }
          };
        });