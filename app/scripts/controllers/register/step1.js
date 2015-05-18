'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:RegisterStep1Controller
 * @description
 * # RegisterStep1Controller
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterStep1Controller', function($scope, candidate) {
            $scope.candidate = candidate;
            $scope.titleary = ['Mr', 'Mrs', 'Ms'];
            $scope.Date = Date;
        });
