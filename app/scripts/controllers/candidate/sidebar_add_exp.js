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

          $scope.gotoPrevious = function() {
            $scope.mainData.step--;
          };

          //check if all dates are selected
          $scope.isAllDatesEntered = function(items) {
            var dateVals = [];
            items.forEach(function(item) {
              dateVals.push(item.date.getTime());
            });
            dateVals = $.unique(dateVals);
            if (dateVals.length === $scope.expenseData.daysInRange.length - 1) {
              return true;
            }
            MsgService.danger('All days should be selected.');
            return false;
          };

          //check if date has already been added
          $scope.isAlreadyAddedDate = function(date, items) {
            if (date === 'all') {
              return items.length > 0;
            }
            var filtered = items.filter(function(val) {
              return val.date.getTime() === date.getTime();
            });
            return date && filtered.length > 0;
          };

          $scope.normalizeTables = function() {
            var $tableBody = $('#tableBody'),
                    $tableHeader = $('#tableHeader'),
                    thTr = $tableHeader.find('tr')[0],
                    $ths = $(thTr).find('th'),
                    tr0 = $tableBody.find('tr')[0],
                    $tds = $(tr0).children();
            $ths.each(function(index) {
              $(this).css('width', $($tds[index]).width() + 'px');
            });
          };

          $scope.addAllDatesData = function(data, callback) {
            $scope.expenseData.daysInRange.forEach(function(dateItem) {
              if (dateItem.object !== 'all') {
                var newData = angular.copy(data);
                newData.date = dateItem.object;
                callback(newData);
              }
            });
          };

        });

