'use strict';
angular.module('origApp.controllers')


.controller('sppController', function($scope, parentScope, HttpResource, $http, $modalInstance) {

    $scope.candidateId = parentScope.candidateId;
    $scope.spp = {};
});
