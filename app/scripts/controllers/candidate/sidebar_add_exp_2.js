'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp2Controller', function($scope, HttpResource) {
          $scope.agencies = HttpResource.model('agencies').query({});
        });

