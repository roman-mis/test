'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:RegisterStep2Controller
 * @description
 * # RegisterStep2Controller
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterStep2Controller', function($scope, candidate, ConstantsResource) {            
            console.log(candidate);
            $scope.candidate = candidate;
            $scope.genders = [{key:'M', value:'MALE'}, {key:'F', value:'FEMALE'}];
            $scope.nationality = ConstantsResource.get('nationalities');
            console.log($scope.nationality);
        });
