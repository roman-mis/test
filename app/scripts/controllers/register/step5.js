'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:RegisterHomeCtrl
 * @description
 * # RegisterHomeCtrl
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterStep5Controller', function($scope, candidate) {
            $scope.candidate = candidate;
            console.log(candidate);
        });
