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
            $scope.candidate = {
                bankName: candidate.getAttribute('bankName'),
                accountName: candidate.getAttribute('accountName'),
                sortCode: candidate.getAttribute('sortCode'),
                accountNumber: candidate.getAttribute('accountNumber'),
                bankRoomNumber: candidate.getAttribute('bankRoomNumber')
            };
            $scope.saveEdition = function() {
                candidate.setAttributes({
                    bankName: $scope.candidate.bankName,
                    accountName: $scope.candidate.accountName,
                    sortCode: $scope.candidate.sortCode,
                    accountNumber: $scope.candidate.accountNumber,
                    bankRoomNumber: $scope.candidate.bankRoomNumber
                });
                $scope.$parent.confirm.BankDetail = true;
                return true;
            };
        });