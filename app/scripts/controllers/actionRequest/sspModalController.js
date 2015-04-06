'use strict';
angular.module('origApp.controllers')
    .controller('sspModalController', function ($scope, parentScope, HttpResource, ModalService, MsgService, $modalInstance) {
        $scope.candidateId =parentScope.candidateId;
        $scope.candidate = parentScope.candidate;
        $scope.showMe = parentScope.showMe;

        HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
            console.log(data);
            $scope.contactdetail = data.data.object;
            //   $scope.fullname = ($scope.candidateInfo.firstName + ' ' + $scope.candidateInfo.lastName);
        }, function (err) {});

        $scope.cancel = function (i, v) {
            $scope.ssp.days[i].amount = v;
        };
        $scope.remove = function (i) {

            $scope.ssp.days.splice(i, 1);

        };
        $scope.save = function () {
            HttpResource.model('actionrequests').create('')
                .patch($scope.ssp.id).then(function () {
                    MsgService.success('Successfully saved.');
                    $scope.closeModal();
                });
        };
        $scope.saveAndApprove = function () {
            HttpResource.model('actionrequests/' + $scope.ssp.id + '').create('')
                .patch('approve').then(function () {
                    MsgService.success('Successfully saved and approved.');
                    $scope.closeModal();
                });
        };
        $scope.saveAndReject = function () {
            HttpResource.model('actionrequests/' + $scope.ssp.id + '').create('')
                .patch('reject').then(function () {
                    MsgService.success('Successfully saved and approved.');
                    $scope.closeModal();
                });
        };
        $scope.saveAndRefer = function () {
            HttpResource.model('actionrequests/' + $scope.ssp.id + '').create('')
                .patch('refer').then(function () {
                    MsgService.success('Successfully saved and approved.');
                    $scope.closeModal();
                });
        };

        $scope.closeModal = function () {
            $modalInstance.close();
        };

    });
