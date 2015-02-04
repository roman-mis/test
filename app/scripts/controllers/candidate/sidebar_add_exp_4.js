'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp4Controller', function($scope, HttpResource, MsgService) {
          $scope.expenseData.documentTimes = [];

          $scope.defaultAddData = {
            date: '',
            startHours: '09',
            startMins: '00',
            endHours: '17',
            endMins: '00'
          };
          $scope.addData = angular.copy($scope.defaultAddData);

          $scope.onDateChanged = function() {
            var filtered = $scope.expenseData.documentTimes.filter(function(val) {
              return (typeof ($scope.addData.date) === 'string' && val.date === $scope.addData.date)
                      || (typeof ($scope.addData.date) === 'object' && typeof (val.date) === 'object' && val.date.getTime() === $scope.addData.date.getTime());
            });
            $scope.alreadyAdded = $scope.addData.date && filtered.length > 0;
          };

          $scope.add = function() {
            $scope.expenseData.documentTimes.push({
              date: $scope.addData.date,
              startTime: $scope.addData.startHours + ':' + $scope.addData.startMins,
              endTime: $scope.addData.endHours + ':' + $scope.addData.endMins
            });
            $scope.addData = angular.copy($scope.defaultAddData);
          };

          $scope.remove = function(index) {
            $scope.expenseData.documentTimes.splice(index, 1);
          };

          $scope.ok = function() {
            //check if all dates is selected
            var bool = false;
            var filtered = $scope.expenseData.documentTimes.filter(function(val) {
              return val.date === 'all';
            });
            if (filtered.length > 0) {
              bool = true;
            }
            filtered = $scope.expenseData.documentTimes.filter(function(val) {
              return val.date !== 'all';
            });
            if (!bool && filtered.length === $scope.expenseData.daysInRange.length - 1) {
              bool = true;
            }

            if ($scope.isAllDatesEntered($scope.expenseData.documentTimes)) {
              $scope.gotoNext();
            }
          };

        });

