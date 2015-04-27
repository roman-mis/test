'use strict';
angular.module('origApp.controllers')
    .controller('CandidateSidebarController', function($scope, $rootScope, ModalService) {

        $scope.isActionRequestCollapsed = true;

        $scope.toggle = function () {
            $scope.isActionRequestCollapsed = !$scope.isActionRequestCollapsed;
        };


        $scope.openDPAWin = function () {
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
            console.log(params);
            console.log('open create task win');
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

        $scope.openAOEWin = function() {
            ModalService.open({
                templateUrl: 'views/candidate/AOE.html',
                parentScope: $scope,
                controller: 'AOEController',
                size: 'md'
            });
        };
        $scope.openSsp = function () {

            ModalService.open({

                templateUrl: 'views/actionRequest/ssp.html',
                parentScope: $scope,
                controller: 'sspModalController',
                size: 'md'
            });
        };

        $scope.openSpp=function(){
            ModalService.open({
                templateUrl:'views/actionRequest/spp.html',
                parentScope:$scope,
                controller:'sppController',
                size:'md'
            });
        };

        $scope.openHolidayPayment=function(){
            ModalService.open({
                templateUrl:'views/actionRequest/holidayPayment.html',
                parentScope:$scope,
                controller:'holidayPaymentController',
                size:'md'
            });
        };

        $scope.openSl=function(){
            ModalService.open({
                templateUrl:'views/actionRequest/sl.html',
                parentScope:$scope,
                controller:'slController',
                size:'md'
            })
        };

        $scope.openP45 = function () {
            ModalService.open({
                templateUrl: 'views/actionRequest/p45.html',
                parentScope: $scope,
                controller: 'p45Ctrl',
                size: 'md'
            })
        };

        $scope.openMp=function(){
            console.log($scope.contactdetail);
            ModalService.open({

                templateUrl:'views/actionRequest/mp.html',
                parentScope:$scope,
                controller:'mpController',
                size:'md'
            })
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






