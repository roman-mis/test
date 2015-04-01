'use strict';
angular.module('origApp.controllers')


.controller('slController', function($scope, parentScope, HttpResource,  ConstantsResource, $http, $modalInstance) {

    $scope.candidateId = parentScope.candidateId;
    $scope.sl = {};


    HttpResource.model('constants/slrAgreements').customGet('', {}, function(data) {
        $scope.constantsLists = data.data;
        console.log('getting data:' +$scope.constantsLists[0].code);
    }, function(err) {});
     
     HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
    }, function(err) {});
});
