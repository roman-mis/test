'use strict';
angular.module('origApp.controllers')


    .controller('holidayPaymentController', function ($scope, parentScope, HttpResource, MsgService, $modalInstance) {

        $scope.candidateId = parentScope.candidateId;
        $scope.holidayPayment = {};
        $scope.candidate = parentScope.candidate;
         HttpResource.model('candidates/' + $scope.candidateId + '/contactdetail').customGet('', {}, function(data) {
        $scope.contactdetail = data.data.object;
        console.log($scope.contactdetail)
        }, function(err) {});

        HttpResource.model('candidates/' + $scope.candidateId + '/payrollvalue').customGet('', {}, function (data) {
            $scope.candidate.payrollValues.holidayPayRetained = data.data.object.payrollValues.holidayPayRetained || '';
        }, function (err) { });

        $scope.sendPayroll = function () {

            HttpResource.model('actionrequests/' + $scope.candidateId + '/holidaypay').
                create($scope.holidayPay.amount).post().then(function (response) {
                    MsgService.success('Holiday fund requested has been sent to payroll.');
                    $modalInstance.close('close');
                }, function (error) {
                    MsgService.danger(error);
                });
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };


    });
