'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddActivityController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, params) {
          $scope.data = {};

          $scope.activityTypes = [
            {key: 'call_log', label: 'Call Log'},
            {key: 'task', label: 'Create Task'},
            {key: 'document', label: 'Create Document'}
          ];

          $scope.agencies = HttpResource.model('agencies').query({});

          $scope.candidate = parentScope.candidate;


          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };

          $scope.next = function() {
            var params = {agency: $scope.data.agency, activityType: $scope.data.activityType};
            switch ($scope.data.activityType) {
              case 'task':
              case 'call_log':
                parentScope.openCreateTaskWin(params);
                break;
              case 'document':
                parentScope.openCreateDocumentWin(params);
                break;
            }
            $modalInstance.close();
          };
        });

