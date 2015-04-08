'use strict';
angular.module('origApp.controllers')


.controller('sspControllers', function($scope, parentScope, HttpResource,  ConstantsResource, $http, $modalInstance,MsgService) {

    $scope.candidateId = parentScope.candidateId;
    $scope.sl = {'haveLoan':false,'payDirectly':false};

    HttpResource.model('constants/slrAgreements').customGet('', {}, function(data) {
        $scope.constantsLists = data.data;
        console.log('getting relationships:' +$scope.constantsLists[0].code);
    }, function(err) {
        console.log(err);
    });

     HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
     //   $scope.fullname = ($scope.candidateInfo.firstName + ' ' + $scope.candidateInfo.lastName);
    }, function(err) {
        console.log(err);
    });
    $scope.submitAction=function(values){

       HttpResource.model('actionrequests/' + $scope.candidateId+'/studentloan').create(values).post().then(function(response) {
                  $scope.sl.haveLoan=false;
                  $scope.sl.payDirectly=false;
                   MsgService.success('Successfully submitted.');

                },function (error) {
                    MsgService.danger(error);
                });
    };
    $scope.closeModal = function() {

        $modalInstance.dismiss('cancel');
    };
});
