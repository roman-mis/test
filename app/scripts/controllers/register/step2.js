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
            $scope.candidate = {
                address1: candidate.getAttribute('address1'),
                address2: candidate.getAttribute('address2'),
                address3: candidate.getAttribute('address3'),
                town: candidate.getAttribute('town'),
                county: candidate.getAttribute('county'),
                postCode: candidate.getAttribute('postCode'),
                gender: candidate.getAttribute('gender'),
                nationality: candidate.getAttribute('nationality'),
                entranceDate: candidate.getAttribute('entranceDate'),
                recentEntranceDate: candidate.getAttribute('recentEntranceDate'),
                payEmployFlag: candidate.getAttribute('payEmployFlag')
            };
            $scope.genders = [{key:'M', value:'MALE'}, {key:'F', value:'FEMALE'}];
            $scope.nationality = ConstantsResource.get('nationalities');
            $scope.saveEdition = function() {
                candidate.setAttributes({
                    address1: $scope.candidate.address1,
                    address2: $scope.candidate.address2,
                    address3: $scope.candidate.address3,
                    town: $scope.candidate.town,
                    county: $scope.candidate.county,
                    postCode: $scope.candidate.postCode,
                    gender: $scope.candidate.gender,
                    nationality: $scope.candidate.nationality.code,
                    entranceDate: $scope.candidate.entranceDate,
                    recentEntranceDate: $scope.candidate.recentEntranceDate,
                    payEmployFlag: $scope.candidate.payEmployFlag
                });
                $scope.$parent.confirm.ContactDetail1 = true;
                return true;
            };

        });
