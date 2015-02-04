'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp5Controller', function($scope, HttpResource, MsgService, ValidationHelper) {
          $scope.expenseData.postCodes = [];

          $scope.defaultAddData = {
            date: '',
            code: ''
          };
          $scope.addData = angular.copy($scope.defaultAddData);

          $scope.onDateChanged = function() {
            $scope.alreadyAdded = $scope.isAlreadyAddedDate($scope.addData.date, $scope.expenseData.postCodes);
          };

          $scope.add = function() {
            //check if there is invalid post code
            var codes = $scope.addData.code.split(/,/g).map(function(item) {
              return $.trim(item);
            });
            codes = $.unique(codes.filter(function(item) {
              return item !== '';
            }));
            if (codes.length === 0) {
              MsgService.danger('There are no valid postcodes that have been entered.');
              return;
            }
            var invalidCodes = [];
            codes.forEach(function(val) {
              if (!ValidationHelper.isValidPostCode(val)) {
                invalidCodes.push(val);
              }
            });
            if (invalidCodes.length > 0) {
              MsgService.danger('Invalid postcode: ' + invalidCodes.join(', '));
              return;
            }

            $scope.expenseData.postCodes.push({
              date: $scope.addData.date,
              codes: codes
            });
            $scope.addData = angular.copy($scope.defaultAddData);
          };

          $scope.remove = function(index) {
            $scope.expenseData.postCodes.splice(index, 1);
          };

          $scope.ok = function() {
            if ($scope.isAllDatesEntered($scope.expenseData.postCodes)) {
              $scope.gotoNext();
            }
          };

        });

