'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp10Controller', function($scope, HttpResource, ConstantsResource, MsgService) {
          
          $scope.types = ConstantsResource.get('otherexpensetypes');

          $scope.ok = function() {
            $scope.isSaving = true;
            HttpResource.model('candidates/' + $scope.mainData.candidateId + '/expenses')
                    .create($scope.sendData)
                    .post()
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        $scope.expenseData.claimReference = response.data.object.claimReference;
                        $scope.gotoNext();
                      }
                    });
          };
          
          $scope.summaries = $scope.generateSummaries();
          $scope.sendData = {
            expense: $scope.attachReceiptsToSendData($scope.expenseData.receiptListData),
            vehicleinformation: $scope.expenseData.vehicleInfo
          };

        });
