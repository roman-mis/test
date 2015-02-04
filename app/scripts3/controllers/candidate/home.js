'use strict';
angular.module('origApp.controllers')
        .controller('CandidateHomeController', function($scope, $stateParams) {
          $scope.candidateId = $stateParams.candidateId;

          //share this data over all sub pages
          $scope.addSubBreadcrumb(null);
        });
