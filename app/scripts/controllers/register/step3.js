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
            $scope.$watch('candidate.details.jobTitle',function(n,o){
               var characters=$scope.candidate.details.jobTitle;
               if(characters){

                 $scope.candidate.details.jobTitle = characters.charAt(0).toUpperCase()+characters.substr(1);
               }

            });
        });
