'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp10Controller', function($scope, HttpResource, ConstantsResource, MsgService, $stateParams) {
          
          $scope.types = ConstantsResource.get('otherexpensetypes');
          $scope.candidateId = $stateParams.candidateId;

          $scope.ok = function() {
            $scope.isSaving = true;
            HttpResource.model('candidates/' + $scope.candidateId + '/expenses')
                    .create($scope.sendData)
                    .post()
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        //console.log(response);
                        $scope.gotoNext();
                      }
                    });
          };
          
          $scope.summaries = $scope.generateSummaries();
          $scope.sendData = $scope.attachReceiptsToSendData($scope.expenseData.receiptListData);

        });
