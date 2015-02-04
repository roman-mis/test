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
            var aItems = items.filter(function(item) {
              return item.date === 'all';
            });
            if (aItems.length > 0) {
              return true;
            }
            var dateVals = [];
            items.forEach(function(item) {
              if (item.date !== 'all') {
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
          
          //check if date has already been added
          $scope.isAlreadyAddedDate = function(date, items){
            var filtered = items.filter(function(val) {
              return (typeof (date) === 'string' && val.date === date)
                      || (typeof (date) === 'object' && typeof (val.date) === 'object' && val.date.getTime() === date.getTime());
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
            $ths.each(function(index){
              $(this).css('width', $($tds[index]).width() + 16 + 'px');
            });
          };

        });

