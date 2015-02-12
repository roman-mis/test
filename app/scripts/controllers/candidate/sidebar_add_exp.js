'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExpController', function($scope, $modalInstance, parentScope, HttpResource, $stateParams, ConstantsResource, MsgService) {

          $scope.mainData = {step: 3, candidateId: $stateParams.candidateId};

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
            MsgService.warn('All days should be selected.');
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
          
          $scope.generateSummaries = function() {
            var summaries = [];
            $scope.expenseData.daysInRange.forEach(function(dateItem) {
              if (dateItem.object === 'all') {
                return;
              }
              var summary = {date: dateItem.object};

              //get transports
              summary.transport = 0;
              $scope.expenseData.transports.forEach(function(item) {
                if (item.date.getTime() === summary.date.getTime()) {
                  summary.transport += item.cost * 1;
                }
              });

              //get subsistence
              summary.subsistence = 0;
              $scope.expenseData.subsistences.forEach(function(item) {
                if (item.date.getTime() === summary.date.getTime()) {
                  summary.subsistence += item.cost * 1;
                }
              });

              //get other
              summary.other = 0;
              $scope.expenseData.others.forEach(function(item) {
                if (item.date.getTime() === summary.date.getTime()) {
                  summary.other += item.cost * 1;
                }
              });

              summary.total = summary.transport + summary.subsistence + summary.other;

              summaries.push(summary);
            });
            
            $scope.expenseData.summaries = summaries;
            
            return summaries;
          };
          
          $scope.generateSendData = function(){
            var data = {agency: $scope.expenseData.agency._id, days: []};
            $scope.expenseData.daysInRange.forEach(function(dateItem) {
              if (dateItem.object === 'all') {
                return;
              }
              var dataItem = {date: dateItem.object, expenses: []};
              $scope.expenseData.times.forEach(function(item) {
                if (item.date.getTime() === dataItem.date.getTime()) {
                  dataItem.startTime = item.startTime + ':00';
                  dataItem.endTime = item.endTime + ':00';
                }
              });
              $scope.expenseData.postCodes.forEach(function(item) {
                if (item.date.getTime() === dataItem.date.getTime()) {
                  dataItem.postcodes = item.codes;
                }
              });

              //get transports
              $scope.expenseData.transports.forEach(function(item) {
                if (item.date.getTime() === dataItem.date.getTime()) {
                  dataItem.expenses.push({
                    expenseType: 'Transport',
                    subType: item.type.description,
                    value: item.cost * 1
                  });
                }
              });

              //get subsistence
              $scope.expenseData.subsistences.forEach(function(item) {
                if (item.date.getTime() === dataItem.date.getTime()) {
                  dataItem.expenses.push({
                    expenseType: 'Subsistence',
                    subType: item.type.description,
                    value: item.cost * 1,
                    description: item.description
                  });
                }
              });

              //get other
              $scope.expenseData.others.forEach(function(item) {
                if (item.date.getTime() === dataItem.date.getTime()) {
                  dataItem.expenses.push({
                    expenseType: 'Other',
                    subType: item.type.description,
                    value: item.cost * 1,
                    description: item.description
                  });
                }
              });
              data.days.push(dataItem);
            });
            
            $scope.expenseData.sendData = data;
            
            return data;
          };
          
          $scope.getListDataFromSendData = function(sendData){
            var listData = [];
            sendData.days.forEach(function(dayItem){
              dayItem.expenses.forEach(function(expenseItem){
                var listItem = angular.copy(expenseItem);
                listItem.date = dayItem.date;
                listData.push(listItem);
              });
            });
            return listData;
          };
          
          $scope.attachReceiptsToSendData = function(receiptData){
            if(!$scope.expenseData.sendData){
              $scope.generateSendData();
            }
            var sendData = $scope.expenseData.sendData;
            sendData.days.forEach(function(dataItem){
              dataItem.expenses = [];
              receiptData.forEach(function(item) {
                if (item.date.getTime() === dataItem.date.getTime()) {
                  var newItem = angular.copy(item);
                  delete newItem.date;
                  delete newItem.checked;
                  dataItem.expenses.push(newItem);
                }
              });
            });
            $scope.expenseData.sendData = sendData;
            return sendData;
          };

          $(window).on('resize', $scope.normalizeTables);
        });

