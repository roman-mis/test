'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp4Controller', function($scope, HttpResource, MsgService) {
          $scope.expenseData.times = [];

          $scope.defaultAddData = {
            date: '',
            startHours: '09',
            startMins: '00',
            endHours: '17',
            endMins: '00'
          };
          $scope.addData = angular.copy($scope.defaultAddData);

          $scope.onDateChanged = function() {
            $scope.alreadyAdded = $scope.isAlreadyAddedDate($scope.addData.date, $scope.expenseData.times);
          };
          
          function addItem(data){
            $scope.expenseData.times.push({
              date: data.date,
              startTime: data.startHours + ':' + data.startMins,
              endTime: data.endHours + ':' + data.endMins
            });
            $scope.addData = angular.copy($scope.defaultAddData);
          }

          $scope.add = function() {
            if($scope.addData.date==='all'){
              $scope.addAllDatesData($scope.addData, addItem);
            }else{
              addItem($scope.addData);
            }
          };

          $scope.remove = function(index) {
            $scope.expenseData.times.splice(index, 1);
            $scope.onDateChanged();
          };

          $scope.ok = function() {
            //reset daysInRange
            var newDaysInRange = [$scope.expenseData.daysInRange[0]];
            $scope.expenseData.times.forEach(function(item){
              newDaysInRange.push({object: item.date, label: moment(item.date).format('ddd DD/MM/YYYY')});
            });
            $scope.expenseData.daysInRange = newDaysInRange;
            
            $scope.gotoNext();
          };

        });

