'use strict';
angular.module('origApp.controllers')


.controller('slController', function($scope, parentScope, HttpResource,  ConstantsResource, $http, $modalInstance) {

    $scope.candidateId = parentScope.candidateId;
    $scope.sl = {};
    $scope.mapLists = {};


    HttpResource.model('constants/slrAgreements').customGet('', {}, function(data) {
        $scope.constantsLists = data.data;
        console.log('getting relationships:' +$scope.constantsLists[0].code);
    }, function(err) {});
     
     HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
     //   $scope.fullname = ($scope.candidateInfo.firstName + ' ' + $scope.candidateInfo.lastName);
    }, function(err) {});
});
