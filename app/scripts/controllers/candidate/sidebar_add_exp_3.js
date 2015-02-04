'use strict';
angular.module('origApp.controllers')
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
            //console.log($scope.expenseData.claimDateRange);
            
            var daysInRange = [{object: 'all', label: 'All dates in selection'}];
            var dt = $scope.expenseData.claimDateRange[0];
            dt.setHours(0, 0, 0, 0);
            for (var i = 0; i < 7; i++) {
              if (dt > $scope.expenseData.claimDateRange[1]) {
                break;
              }
              daysInRange.push({object: dt, label: moment(dt).format('ddd DD/MM/YYYY')});
              dt = new Date(dt.getTime() + 24 * 3600 * 1000);
              dt.setHours(0, 0, 0, 0);
            }
            $scope.expenseData.daysInRange = daysInRange;
            
            $scope.gotoNext();
            $scope.gotoNext();
          };
        });

