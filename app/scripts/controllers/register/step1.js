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
            $scope.candidate = {
                title: candidate.getAttribute('title'),
                firstName: candidate.getAttribute('firstName'),
                lastName: candidate.getAttribute('lastName'),
                emailAddress: candidate.getAttribute('emailAddress'),
                contactNumber: candidate.getAttribute('contactNumber'),
                niNumber: candidate.getAttribute('niNumber'),
                dateOfBirthday: candidate.getAttribute('dateOfBirthday')
            };
            $scope.titleary = ['Mr', 'Mrs', 'Ms'];
            $scope.saveEdition = function() {                
                candidate.setAttributes({
                    title: $scope.candidate.title,
                    firstName: $scope.candidate.firstName,
                    lastName: $scope.candidate.lastName,
                    emailAddress: $scope.candidate.emailAddress,
                    contactNumber: $scope.candidate.contactNumber,
                    niNumber: $scope.candidate.niNumber,
                    dateOfBirthday: $scope.candidate.dateOfBirthday
                })
                $scope.$parent.confirm.ContactDetail1 = true;
                return true;
            };
        })
