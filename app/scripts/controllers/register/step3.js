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
            $scope.candidate = {
                agencyName: candidate.getAttribute('agencyName'),
                jobTitle: candidate.getAttribute('jobTitle'),
                sector: candidate.getAttribute('sector'),
                jobStartDate: candidate.getAttribute('jobStartDate')
            };
            $scope.saveEdition = function() {
                candidate.setAttributes({
                    agencyName: $scope.candidate.agencyName,
                    jobTitle: $scope.candidate.jobTitle,
                    sector: $scope.candidate.sector,
                    jobStartDate: $scope.candidate.jobStartDate
                });
                $scope.$parent.confirm.ContactDetail2  = true;
                return true;
            };
        });
