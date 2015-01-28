'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarCreateTaskController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, params, MsgService) {

          $scope.data = {};
          if (params.agency) {
            $scope.data.agency = params.agency;
          }
          $scope.activityType = params.activityType;


          $scope.candidate = parentScope.candidate;
          $scope.agencies = HttpResource.model('agencies').query({});
          $scope.users = HttpResource.model('users').query({});
          $scope.templates = HttpResource.model('templates').query({templateType: 'TASK'});

          //load constants
          $scope.priorities = ConstantsResource.get('priorities');
          $scope.taskTypes = ConstantsResource.get($scope.activityType === 'callLog' ? 'calllogtasktypes' : 'createtasktypes');
          $scope.statuses = ConstantsResource.get('statuses');

          $scope.onTemplateChange = function(template) {
            $scope.data.templateTitle = template.title;
            $scope.data.templateHtml = template.templateBody;
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.save = function() {
            $scope.isSaving = true;
            var endpointName = $scope.activityType === 'callLog' ? 'calllog' : 'task';
            HttpResource.model('candidates/' + $scope.candidate._id + '/' + endpointName).create($scope.data).post()
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        $modalInstance.close();
                        MsgService.success('New task has been created successfully.');
                      }
                    });
          };
        });

