'use strict';
angular.module('origApp.controllers')
        .controller('CandidatePayrollTaxController', function($scope, $stateParams, HttpResource) {
          $scope.employeesNIpaid = {};
          $scope.candidateId = $stateParams.candidateId;

          //define private variables
          var candidateResource = HttpResource.model('candidates/' + $scope.candidateId);
          HttpResource.model('candidates/' + $scope.candidateId + '/taxdetail').query({}, function (res) {
            $scope.employeesNIpaid.value = res.data.object.employeesNIpaid;
          });

          $scope.employeesNIpaidOptions = [
              {value:'Yes',code: true},
              {value: 'No',code: false}
            ];
            
          //load tax information
          $scope.loadTax = function() {
            $scope.tax = candidateResource.get('payrolltax');
          };

          //save tax information
          $scope.saveTax = function() {
            $scope.isTaxSaving = true;
            candidateResource.create($scope.tax).patch('payrolltax')
                    .then(function(response) {
                      $scope.isTaxSaving = false;
                      if (!HttpResource.flushError(response)) {
                        //success callback
                      }
                    });
          };

          $scope.loadTax();

        });
