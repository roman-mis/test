'use strict';
angular.module('origApp.controllers')


.controller('sppController', function($scope, parentScope, HttpResource,  ConstantsResource, $http, $modalInstance) {

    $scope.candidateId = parentScope.candidateId;
    $scope.spp = {};
     
     HttpResource.model('candidates/' + $scope.candidateId + '/contactdetail').customGet('', {}, function(data) {
        $scope.contactdetail = data.data.object;
        console.log($scope.contactdetail)
    }, function(err) {})
});
