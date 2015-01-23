'use strict';

/**
 * @ngdoc directive
 * @name mspApp.directive:datePicker
 * @description
 * # datePicker
 */

angular.module('origApp.directives')
        .directive('orgTabbar', function($compile) {
            return {
                restrict: 'AE',
                scope: {
                    tabs: '=',
                    active: '@'
                },
                templateUrl: 'views/partials/origtabbar.html',
                replace: true,
                link: function($scope, ele, attrs, c) {
                   return true;
                },
                controller:function($scope, $filter){
                    $scope.captionName = $filter('filter')($scope.tabs, {id:$scope.active}, false)[0]['name'];
                }
            };
        });