'use strict';
angular.module('origApp.controllers')


.controller('slController', function($scope, parentScope, HttpResource,  ConstantsResource, $http, $modalInstance) {

    $scope.candidateId = parentScope.candidateId;
    $scope.sl = {};
     
     HttpResource.model('candidates/' + $scope.candidateId + '/contactdetail').customGet('', {}, function(data) {
        $scope.contactdetail = data.data.object;
        console.log($scope.contactdetail)
    }, function(err) {})
});
