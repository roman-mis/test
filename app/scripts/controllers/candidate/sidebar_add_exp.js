'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExpController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, params) {

          $scope.mainData = {step: 1};

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

        })
        .controller('CandidateSidebarAddExp1Controller', function($scope) {
        })
        .controller('CandidateSidebarAddExp2Controller', function($scope, HttpResource) {
          $scope.agencies = HttpResource.model('agencies').query({});
        })
        .controller('CandidateSidebarAddExp3Controller', function($scope, HttpResource) {
          var currentDate = new Date();
          $scope.minDate = currentDate;
          $scope.expenseData.claimDate = $scope.expenseData.claimDate || currentDate;

          $scope.$watch('expenseData.claimDate', function() {
            setTimeout(function() {
              var that = $('#claim_datepicker td > .btn.active.btn-info');
              if (that.length === 1) {
                that.trigger('click');
              }
            }, 100);
          });

          $(document).on('click', '#claim_datepicker td > .btn', function() {
            var that = this;
            $(that).closest('table').find('td > .btn').removeClass('btn-info active');
            $(that).closest('tr').find('td > .btn').addClass('btn-info active');
          });

          $scope.ok = function() {
            var date = $scope.expenseData.claimDate;
            $scope.expenseData.claimDateRange = [];
            $scope.expenseData.claimDateRange[0] = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
            $scope.expenseData.claimDateRange[1] = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7);
            if ($scope.expenseData.claimDateRange[0] < currentDate) {
              $scope.expenseData.claimDateRange[0] = currentDate;
            }
            console.log($scope.expenseData.claimDateRange);
            $scope.gotoNext();
          };
        })
        .controller('CandidateSidebarAddExp4Controller', function($scope, HttpResource, MsgService) {
          $scope.expenseData.documentTimes = [];
          $scope.days = [{object: 'all', label: 'All dates in selection'}];
          var dt = $scope.expenseData.claimDateRange[0];
          dt.setHours(0, 0, 0, 0);
          for (var i = 0; i < 7; i++) {
            if (dt > $scope.expenseData.claimDateRange[1]) {
              break;
            }
            $scope.days.push({object: dt, label: moment(dt).format('ddd DD/MM/YYYY')});
            dt = new Date(dt.getTime() + 24 * 3600 * 1000);
            dt.setHours(0, 0, 0, 0);
          }

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
            $scope.alreadyAdded = filtered.length > 0;
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
            if (!bool && filtered.length === $scope.days.length - 1) {
              bool = true;
            }

            if (bool) {
              $scope.gotoNext();
            } else {
              MsgService.danger('All days should be selected.');
            }
          };

        });

