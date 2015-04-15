'use strict';
angular.module('origApp.controllers')


.controller('slController', function($scope, parentScope, HttpResource, ConstantsResource, $http, $modalInstance, MsgService) {

    $scope.candidateId = parentScope.candidateId;

    if(!$scope.studentLoan){

      $scope.studentLoan = {
        'haveLoan': false,
        'payDirectly': false
       }

    }


    HttpResource.model('constants/slrAgreements').customGet('', {}, function(data) {
        $scope.constantsLists = data.data;
    }, function(err) {});

    HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
    }, function(err) {});
    $scope.submitAction = function(values) {
        $scope.slObject={};
        $scope.slObject.studentLoan=values;
        HttpResource.model('actionrequests/' + $scope.candidateId + '/studentloan').create($scope.slObject).post().then(function(response) {

            MsgService.success('Successfully submitted.');
            $scope.closeModal();

        }, function(error) {
            MsgService.danger(error);
        });
    };
    $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.submitStudentLoan = function() {
            HttpResource.model('actionrequests').create($scope)
                .patch($scope.id).then(function() {
                    MsgService.success('Successfully saved.');
                    $modalInstance.dismiss('cancel');
                });
    };
    $scope.saveAndApprove = function() {

            HttpResource.model('actionrequests/' + $scope.id + '').create($scope)
                .patch('approve').then(function() {
                    MsgService.success('Successfully saved and approved.');
                   $modalInstance.close();

                });

    };
    $scope.saveAndReject = function() {

            HttpResource.model('actionrequests/' + $scope.id + '').create($scope)
                .patch('reject').then(function() {
                    MsgService.success('Successfully saved and rejected.');
                   $modalInstance.close();

                });

    };
    $scope.saveAndRefer = function() {

            HttpResource.model('actionrequests/' + $scope.id + '').create($scope)
                .patch('refer').then(function() {
                    MsgService.success('Successfully saved and referred.');
                    $modalInstance.close();

                });

    };
});
