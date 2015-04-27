'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp10Controller', function ($scope, HttpResource, ConstantsResource) {
            $scope.types = ConstantsResource.get('otherexpensetypes');
            $scope.ok = function () {
                $scope.isSaving = true;
                $scope.sendData.source = 'wizard';                                 
                HttpResource.model('candidates/' + $scope.mainData.candidateId + '/expenses')
                        .create($scope.sendData)
                        .post()
                        .then(function (response) {
                            console.log(response);
                            $scope.isSaving = false;
                            $scope.expenseData.claimReference = response.data.claimReference;
                            $scope.gotoNext();
                        });
            };

            $scope.okManual = function () {
                $scope.summaries = $scope.generateSummaries();
                $scope.sendData = {
                    expense: $scope.generateSendData(),
                    vehicleInformation: $scope.expenseData.vehicleInfo
                };
                // $scope.isSaving = true;
                console.log($scope.sendData);
                HttpResource.model('candidates/' + $scope.mainData.candidateId + '/expenses')
                        .create($scope.sendData)
                        .post()
                        .then(function (response) {
                            // $scope.isSaving = false;

                            // if (!HttpResource.flushError(response)) {
                            $scope.expenseData.claimReference = response.data.claimReference;
                            // }
                        });
            };

            try {
                $scope.summaries = $scope.generateSummaries();
                $scope.sendData = {
                    expense: $scope.attachReceiptsToSendData($scope.expenseData.receiptListData),
                    vehicleInformation: $scope.expenseData.vehicleInfo
                };
            } catch (e) {
                console.log('probably on manual add expenses mode');
            }
            console.log($scope.sendData);

        });
