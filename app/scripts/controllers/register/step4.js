'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:RegisterStep4Controller
 * @description
 * # RegisterStep4Controller
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterStep4Controller', function($scope, candidate) {            
            $scope.candidate = candidate;
            console.log(candidate);
        });