'use strict';
angular.module('origApp.controllers')
.controller('CandidateCompilanceController', function($scope, HttpResource, ModalService, $stateParams, ConstantsResource) {
  $scope.addSubBreadcrumb({'text': 'Compilance'});
});