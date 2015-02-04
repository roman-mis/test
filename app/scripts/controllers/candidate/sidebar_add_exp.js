'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExpController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, MsgService) {

          $scope.mainData = {step: 3};

          $scope.expenseData = {};

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };

          $scope.gotoNext = function() {
            $scope.mainData.step++;
          };

          //check if all dates are selected
          $scope.isAllDatesEntered = function(items) {
            var aItems = items.filter(function(item) {
              return item.date === 'all';
            });
            if (aItems.length > 0) {
              return true;
            }
            var dateVals = [];
            items.forEach(function(item) {
              if(item.date !== 'all'){
                dateVals.push(item.date.getTime());
              }
            });
            dateVals = $.unique(dateVals);
            if (dateVals.length === $scope.expenseData.daysInRange.length - 1) {
              return true;
            }
            MsgService.danger('All days should be selected.');
            return false;
          };

          $scope.gotoPrevious = function() {
            $scope.mainData.step--;
          };

        });

