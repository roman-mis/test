'use strict';
angular.module('origApp.controllers')


    .controller('holidayPaymentController', function ($scope, parentScope, HttpResource, MsgService, $modalInstance) {

        $scope.candidateId = parentScope.candidateId;
        console.log($scope.candidateId);
        if(!$scope.hpObject){
           $scope.hpObject={};
           $scope.hpObject.holidaypay = {};
        }
        $scope.candidate = parentScope.candidate;
        $scope.candidate.payrollValues={holidayPayRetained:0};
        HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
        }, function(err) {});

        HttpResource.model('candidates/' + $scope.candidateId + '/payrollvalue').customGet('', {}, function (data) {
            $scope.candidate.payrollValues.holidayPayRetained = data.data.object.payrollValues.holidayPayRetained || '';
        }, function (err) { });

        $scope.sendPayroll = function (val) {
          if(val){
            HttpResource.model('actionrequests/' + $scope.candidateId + '/holidaypay').
                create($scope.hpObject).post().then(function (response) {
                    MsgService.success('Holiday fund requested has been sent to payroll.');
                    $modalInstance.close('close');
                }, function (error) {
                    MsgService.danger(error);
                });
            }else{

                $scope.submitted=true;
            }
        };
        $scope.savePayroll=function(){

           HttpResource.model('actionrequests').create($scope.hpObject)
                .patch($scope.hpObject.id).then(function () {
                    MsgService.success('Successfully saved.');
                    $scope.closeModal();
                });

        };

        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };


    });
