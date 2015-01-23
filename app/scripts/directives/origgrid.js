'use strict';

angular.module('origApp.directives')
        .directive('origGrid', function() {
          return {
            restrict: 'A',
            scope: {
              options: '=origGrid',
              externalScope: '='
            },
            controller: function($scope) {
              var defaultOptions = {
                limit: 20,
                maxVisiblePages: 5
              };

              for(var k in defaultOptions){
                if (typeof ($scope.options[k]) === 'undefined') {
                  $scope.options[k] = defaultOptions[k];
                }
              }

              $scope.options.exteralScope = $scope.externalScope;

              $scope.getExternalScope = function() {
                return $scope.options.exteralScope;
              };

              $scope.$watch('options.limit', function(nValue, oValue) {
                if (nValue !== oValue && $scope.options.onLimitChanged) {
                  $scope.options.onLimitChanged(nValue);
                }
              });

              $scope.$watch('options.currentPage', function(nValue, oValue) {
                if (nValue !== oValue && $scope.options.onPageChanged) {
                  $scope.options.onPageChanged(nValue);
                }
              });
            },
            templateUrl: 'views/partials/origgrid.html',
            replace: true,
            link: function($scope, ele, attrs, c) {
              return true;
            }
          };
        })
        .directive('origGridRow', function($compile) {
          return {
            restrict: 'AC',
            scope: {
              gridOptions: '=',
              row: '='
            },
            controller: function($scope) {
              $scope.getExternalScope = function() {
                return $scope.gridOptions.exteralScope;
              };
            },
            template: '<td orig-grid-cell grid-options="gridOptions" row="row" column="col" ng-repeat="col in gridOptions.columns" class="text-{{col.textAlign}}"></td>',
            link: function($scope, ele, attrs, c) {
              if ($scope.gridOptions.rowTemplate) {
                ele.html($scope.gridOptions.rowTemplate);
                $compile(ele.contents())($scope);
              }
              return true;
            }
          };
        })
        .directive('origGridCell', function($compile) {
          return {
            restrict: 'AC',
            scope: {
              gridOptions: '=',
              row: '=',
              column: '='
            },
            controller: function($scope) {
              $scope.getExternalScope = function() {
                return $scope.gridOptions.exteralScope;
              };
            },
            template: '{{cellValue}}',
            link: function($scope, ele, attrs, c) {
              $scope.cellValue = $scope.row[$scope.column.field];
              if ($scope.column.cellTemplate) {
                ele.html($scope.column.cellTemplate);
                $compile(ele.contents())($scope);
              }
              return true;
            }
          };
        });