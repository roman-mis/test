'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExpensesController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, params) {

          $scope.mainData = {step: 1};
  
          $scope.expenseData = {};

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          
          $scope.gotoNext = function(){
            $scope.mainData.step++;
          };

          $scope.gotoPrevious = function(){
            $scope.mainData.step--;
          };

        })
        .controller('CandidateSidebarAddExpenses1Controller', function($scope) {
        })
        .controller('CandidateSidebarAddExpenses2Controller', function($scope, HttpResource) {
          $scope.agencies = HttpResource.model('agencies').query({});
        })
        .controller('CandidateSidebarAddExpenses3Controller', function($scope, HttpResource) {
          var currentDate = new Date();
          $scope.minDate = currentDate;
          $scope.expenseData.claimDate = currentDate;
  
          $scope.$watch('expenseData.claimDate', function(){
            setTimeout(function(){
              var that = $('#claim_datepicker td > .btn.active.btn-info');
              if(that.length === 1){
                that.trigger('click');
              }
            }, 100);
          });
          
          $(document).on('click', '#claim_datepicker td > .btn', function(){
            var that = this;
            $(that).closest('table').find('td > .btn').removeClass('btn-info active');
            $(that).closest('tr').find('td > .btn').addClass('btn-info active');
          });
          
          $scope.ok = function(){
            var date = $scope.expenseData.claimDate;
            $scope.expenseData.claimDateRange = [];
            $scope.expenseData.claimDateRange[0] = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
            $scope.expenseData.claimDateRange[1] = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6);
            if($scope.expenseData.claimDateRange[0] < currentDate){
              $scope.expenseData.claimDateRange[0] = currentDate;
            }
            //console.log($scope.expenseData.claimDateRange);
            $scope.gotoNext();
          };
        });

