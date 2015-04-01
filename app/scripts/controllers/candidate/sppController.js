'use strict';
angular.module('origApp.controllers')


.controller('sppController', function($scope, parentScope, HttpResource,  ConstantsResource, $http, $modalInstance) {

    $scope.candidateId = parentScope.candidateId;
    $scope.spp = {};


     HttpResource.model('constants/relationships').customGet('', {}, function(data) {
        $scope.relationships = data.data;
        console.log('getting relationships:' +$scope.relationships);
    }, function(err) {});

     HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
    }, function(err) {});
});
