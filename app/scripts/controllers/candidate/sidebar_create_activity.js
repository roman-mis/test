'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddActivityController', function($scope, $modalInstance, parentScope, HttpResource) {
          $scope.data = {};

          $scope.activityTypes = [
            {key: 'callLog', label: 'Call Log'},
            {key: 'task', label: 'Create Task'},
            {key: 'document', label: 'Upload Document'},
            {key: 'document', label: 'Create Document'},
            {key: 'email', label: 'Create Email'},
            {key: 'textMessage', label: 'Create Text Message'},
            {key: 'timesheet', label: 'Add Timesheet'},
            {key: 'expenses', label: 'Add Expenses'},
            {key: 'AOE', label: 'Attachment of Earnings'}
          ];

          $scope.agencies = HttpResource.model('agencies').query({});
          $scope.candidate = parentScope.candidate;


          $scope.cancel = function() {
            console.log($scope.agencies);
            $modalInstance.dismiss('cancel');
          };

          $scope.next = function() {
            var params = {agency: $scope.data.agency, activityType: $scope.data.activityType};
            switch ($scope.data.activityType) {
              case 'task':
                // break;
              case 'callLog':
                parentScope.openCreateTaskWin(params);
                break;
              case 'document':
                parentScope.openCreateDocumentWin(params);
                break;
              case 'AOE':
                parentScope.openAOEWin();
              break;
            }
            $modalInstance.close();
          };
        });

