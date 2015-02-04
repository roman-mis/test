'use strict';

/**
 * @ngdoc function
 * @name origApp.controllers:RegisterConfirmController
 * @description
 * # RegisterConfirmController
 * Controller of the originemApp
 */
angular.module('origApp.controllers')
        .controller('RegisterConfirmController', function($scope, $rootScope) {
          $scope.$watch(function() {
            return $scope.$parent.confirm.ContactDetail1 && $scope.$parent.confirm.ContactDetail2 && $scope.$parent.confirm.BankDetail && $scope.$parent.confirm.TaxDetail && $scope.$parent.confirm.AcceptTerms;
          }, function(newvalue) {
            $scope.$parent.isSubmitDisable = newvalue != true;
          });
          $scope.onSubmit = function() {
            return true;
          };
        });