'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp2Controller', function($scope, HttpResource) {
          console.log($scope.expenseData, $scope.mainData.candidateId);
          var payrollProducts = HttpResource.model('candidates/' + $scope.mainData.candidateId + '/payrollproduct').query({}, function(){
            $scope.agencies = [];
            angular.forEach(payrollProducts, function(pp) {
              if($scope.agencies.indexOf(pp.agency)===-1) {
                $scope.agencies.push(pp.agency); 
              }
            });
          });
          //$scope.agencies = HttpResource.model('agencies').query({});
        });

  