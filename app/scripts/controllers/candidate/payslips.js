'use strict';
angular.module('origApp.controllers')
.controller('CandidatePayslipsController', function($scope, HttpResource, ModalService, $stateParams, ConstantsResource) {
  $scope.addSubBreadcrumb({'text': 'Payslips'});
});