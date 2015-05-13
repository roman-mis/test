'use strict';
angular.module('origApp.controllers')
.controller('CandidateHistoryController', function($scope, HttpResource, ModalService, $stateParams, ConstantsResource) {
  $scope.addSubBreadcrumb({'text': 'History'});
});