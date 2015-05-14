'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarCreateTaskController', function($q,$rootScope,$scope, $modalInstance, parentScope, HttpResource, ConstantsResource, params, MsgService) {
          $scope.permissions = parentScope.permissions;
          $scope.data = {};

          var prioritiesDone = false;
          var statusesDone = false;
          var taskDone = false;
          console.log($rootScope.currentUser);
          console.log(parentScope.candidate);
          $scope.activityType = params.activityType;
          $scope.candidate = parentScope.candidate;
          var promise = $q.defer();
          
          HttpResource.model('constants/priorities').query({},function(data){
            prioritiesDone = true;
            $scope.priorities = data.data;
            console.log('$scope.priorities  =====>');
            console.log($scope.priorities);
            if(statusesDone === true && taskDone ===true){
              promise.resolve('done');
            }
          });

          HttpResource.model('constants/statuses').query({},function(data){
            statusesDone = true;
            $scope.statuses = data.data;
            if(prioritiesDone === true && taskDone ===true){
              promise.resolve('done');
            }
          });

          HttpResource.model('constants/'+ ($scope.activityType === 'callLog' ? 'calllogtasktypes' : 'createtasktypes')).query({},function(data){
            taskDone = true;
            $scope.taskTypes = data.data;
            if(prioritiesDone === true && statusesDone ===true){
              promise.resolve('done');
            }
          });

          function getByDescription(values,description){
            var code = -1;
            console.log(description);
            console.log('**************************');
            for(var i = 0; i < values.length; i++){
            console.log(values[i].description);

              if(values[i].description === description){
                code = values[i].code;
                break;
              }
            }
            return code;
          }


          function getTaskTypes(values){
            var newTaskTypes   = [];
            console.log('**************************');
            for(var i = 0; i < values.length; i++){
              for(var j = 0; j < $scope.taskTypes.length; j++){
                if($scope.taskTypes[j].description === values[i]){
                  console.log($scope.taskTypes[j].description);
                  newTaskTypes.push($scope.taskTypes[j]);
                  break;
                }                
              }
            }
            return newTaskTypes;
          }

          if($rootScope.currentUser.userType === 'WK'){
            $scope.agencies = HttpResource.model('candidates/' + parentScope.candidate._id + '/payrollproduct').query({});
            //assign values
            $scope.data.agency = params.agency;
            $scope.data.templateTitle = $scope.permissions.rightToolBar.callLog.functionality.title.setTo;
            promise.promise.then(function(data){
              console.log('********************'+data+'********************');
              $scope.taskTypes = getTaskTypes($scope.permissions.rightToolBar.callLog.functionality.taskType.filter.values);
              $scope.data.status = getByDescription($scope.statuses, $scope.permissions.rightToolBar.callLog.functionality.status.setTo);
              $scope.data.priority = getByDescription($scope.priorities, $scope.permissions.rightToolBar.callLog.functionality.selectPriority.setTo);
            });
          }else{
            $scope.taskTypes = ConstantsResource.get($scope.activityType === 'callLog' ? 'calllogtasktypes' : 'createtasktypes');
            $scope.templates = HttpResource.model('templates').query({templateType: 'TASK'});
            $scope.agencies = HttpResource.model('candidates/' + parentScope.candidate._id + '/payrollproduct').query({});
            $scope.data.agency = params.agency;
            $scope.users = HttpResource.model('users').query({});
          }
          $scope.activityType = params.activityType;

          $scope.candidate = parentScope.candidate;
          $scope.agencies = HttpResource.model('candidates/' + parentScope.candidate._id + '/payrollproduct').query({});
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

