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
            console.log(candidate);
            //updated
            // $scope.saveEdition = function() {                
            //     candidate.setAttributes({
            //         title: $scope.candidate.title,
            //         firstName: $scope.candidate.firstName,
            //         lastName: $scope.candidate.lastName,
            //         emailAddress: $scope.candidate.emailAddress,
            //         contactNumber: $scope.candidate.contactNumber,
            //         niNumber: $scope.candidate.niNumber,
            //         dateOfBirthday: $scope.candidate.dateOfBirthday
            //     })
            //     $scope.$parent.confirm.ContactDetail1 = true;
            //     return true;
            // };
        })
