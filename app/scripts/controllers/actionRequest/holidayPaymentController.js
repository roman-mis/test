'use strict';
angular.module('origApp.controllers')


.controller('holidayPaymentController', function($scope, parentScope, HttpResource, MsgService, $modalInstance) {

    $scope.candidateId = parentScope.candidateId;
    if (!$scope.hpObject) {
        $scope.hpObject = {};
        $scope.hpObject.holidaypay = {};
    }
    $scope.candidate = parentScope.candidate;
    $scope.candidate.payrollValues = {
        holidayPayRetained: 0
    };
    HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
    }, function(err) {});

    HttpResource.model('candidates/' + $scope.candidateId + '/payrollvalue').customGet('', {}, function(data) {
        console.log(data);
        $scope.candidate.payrollValues.holidayPayRetained = data.data.object.payrollValues.holidayPayRetained || '';
    }, function(err) {});

    $scope.sendPayroll = function(val) {
        if (val && $scope.hpObject.holidayPay.amount <= $scope.candidate.payrollValues.holidayPayRetained) {
            HttpResource.model('actionrequests/' + $scope.candidateId + '/holidaypay').
            create($scope.hpObject).post().then(function(response) {
                MsgService.success('Holiday fund requested has been sent to payroll.');
                $modalInstance.close('close');
            }, function(error) {
                MsgService.danger(error);
            });
        } else {

            $scope.submitted = true;

        }
    };
    $scope.savePayroll = function(val,type) {
      if (val && $scope.hpObject.holidayPay.amount <= $scope.candidate.payrollValues.holidayPayRetained) {

        switch (type){

           case 'save':
            HttpResource.model('actionrequests').create($scope.hpObject)
            .patch($scope.id).then(function() {
                MsgService.success('Successfully saved.');
               $modalInstance.dismiss('cancel');
            });
            break;

            default :
             HttpResource.model('actionrequests/' + $scope.id + '').create($scope.hpObject)
                .patch(type).then(function() {
                    MsgService.success('Successfully saved and approved.');
                   $modalInstance.close();

                });


        };

        }else{

          $scope.submitted = true;

        }

    };


    $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
    };


});
