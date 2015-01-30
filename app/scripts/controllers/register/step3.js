'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:RegisterStep3Controller
 * @description
 * # RegisterStep3Controller
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterStep3Controller', function($scope, candidate) {            
            $scope.candidate = candidate;
        });
