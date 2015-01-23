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
            $scope.candidate = {
                haveP45Document: candidate.getAttribute('haveP45Document'),
                fileName: candidate.getAttribute('fileName'),
                p45Uploaded: candidate.getAttribute('p45Uploaded'),
                p46Complted: candidate.getAttribute('p46Complted')
            };
            $scope.saveEdition = function() {
                candidate.setAttributes({
                    haveP45Document: $scope.candidate.haveP45Document,
                    fileName: $scope.candidate.fileName,
                    p45Uploaded: $scope.candidate.p45Uploaded,
                    p46Complted: $scope.candidate.p46Complted
                });
                $scope.$parent.confirm.TaxDetail = true;
                return true;
            };
        });
