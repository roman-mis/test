'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarController', function($scope, ModalService) {
          $scope.openDPAWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_dpa_questions.html',
              parentScope: $scope,
              controller: 'CandidateSidebarDPAController'
            });
          };

          $scope.openOnboardingWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_onboarding.html',
              parentScope: $scope,
              controller: 'CandidateSidebarOnboardingController',
              size: 'lg'
            });
          };

          /*$scope.openAddCallLogWin = function(params) {
           ModalService.open({
           templateUrl: 'views/candidate/_add_call_log.html',
           parentScope: $scope,
           params: params,
           controller: '_CandidateSidebarAddCallLogController',
           size: 'lg'
           });
           };*/

          $scope.openCreateTaskWin = function(params) {
            ModalService.open({
              templateUrl: 'views/candidate/_create_task.html',
              parentScope: $scope,
              params: params,
              controller: 'CandidateSidebarCreateTaskController',
              size: 'lg'
            });
          };

          $scope.openCreateDocumentWin = function(params) {
            ModalService.open({
              templateUrl: 'views/candidate/_create_document.html',
              parentScope: $scope,
              params: params,
              controller: 'CandidateSidebarCreateDocumentController',
              size: 'lg'
            });
          };

          $scope.openAddActivityWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_add_activity.html',
              parentScope: $scope,
              controller: 'CandidateSidebarAddActivityController'
            });
          };

          $scope.openSalaryCalculatorWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_salary_calculator.html',
              parentScope: $scope,
              controller: '_CandidateSidebarSalaryCalculatorController',
              size: 'lg'
            });
          };

          $scope.openAddExpensesWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_add_exp.html',
              parentScope: $scope,
              controller: 'CandidateSidebarAddExpController',
              backdrop: 'static'
            });
          };
	
		      $scope.openAddTimesheetWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_add_timesheet.html',
              parentScope: $scope,
              controller:'CandidateSidebarAddTimesheetController',
              size:'lg',
              backdrop: 'static'
            });
          };
          $scope.openSSP = function () {
            ModalService.open({
              templateUrl: 'views/candidate/sidebar_statuary_sick_pay.html',
              parentScope: $scope,
              controller: 'statuarySickPayCtrl',
              size:'md'
            });
          };
		})

        //DPA questions
        .controller('CandidateSidebarDPAController', function($scope, $modalInstance) {
          $scope.dpaLists = [
            {question: 'Test questions 1', answer: ''},
            {question: 'Test questions 2', answer: ''},
            {question: 'Test questions 3', answer: ''}
          ];
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.ok = function() {
            $modalInstance.close();
          };
        })

        //ngTagsInput 
        .controller('CandidatengTagsInputController', function($scope) {
          $scope.tagsMonday = [
            {text: 'just'},
            {text: 'some'}
          ];
          $scope.tagsTuesday = [
            {text: 'just'},
            {text: 'some'}
          ];
          $scope.tagsWednesday = [
            {text: 'just'},
            {text: 'some'}
          ];
          $scope.tagsThursday = [
            {text: 'just'},
            {text: 'some'}
          ];
          $scope.tagsFriday = [
            {text: 'just'},
            {text: 'some'}
          ];
        })

        //Salary-calculator
        .controller('_CandidateSidebarSalaryCalculatorController', function($scope, $modalInstance) {
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.ok = function() {
            $modalInstance.close();
          };
        });






