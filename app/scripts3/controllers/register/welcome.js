'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:RegisterHomeCtrl
 * @description
 * # RegisterHomeCtrl
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterWelcomeController', function($scope, candidate) {
            $scope.firstName = candidate.getAttribute('firstName');
            $scope.lastName =  candidate.getAttribute('lastName');
            $scope.emailAddress = candidate.getAttribute('emailAddress');
        });
