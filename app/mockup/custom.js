(function () {
    var app = angular.module('origApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ui.bootstrap',
        'ui.select',
        'origApp.directives']);

    app.directive('candidateMeta', function () {
        return {
            restrict: 'E',
            templateUrl: 'mockup/candidate-meta.html'
        };
    });

    app.directive("candidateTabs", function () {
        return {
            restrict: "E",
            templateUrl: "mockup/candidate-tabs.html",
            controller: function () {
                this.tabCaptions = ['', 'Home', 'Contact', 'Payroll', 'Payslips', 'Agencies', 'Compliance', 'History'];
                this.isCollapsed = true;
                this.tab = 1;

                this.caption = this.tabCaptions[this.tab];

                this.isSet = function (checkTab) {
                    return this.tab === checkTab;
                };

                this.setTab = function (activeTab) {
                    this.tab = activeTab;
                    this.isCollapsed = true;
                    this.caption = this.tabCaptions[this.tab];
                };
            },
            controllerAs: "tab"
        };
    });

    app.controller('tabPayroll', function () {
        this.tabroll = 1;

        this.setTab = function (newValue) {
            this.tabroll = newValue;
        };

        this.isSet = function (tabName) {
            return this.tabroll === tabName;
        };
    });

    app.directive("candidateRecentMessages", function () {
        return {
            restrict: "E",
            templateUrl: "mockup/candidate-recent-messages.html",
            controller: function () {

            }
        };
    });

    app.directive('candidateHistory', function () {
        return {
            restrict: 'E',
            templateUrl: 'mockup/candidate-history.html'
        };
    });

    app.directive('candidatePayslip', function () {
        return {
            restrict: 'E',
            templateUrl: 'mockup/candidate-payslip.html'
        };
    });


    app.directive('candidateExpenses', function () {
        return {
            restrict: 'E',
            templateUrl: 'mockup/candidate-expenses.html'
        };
    });

    app.controller('AccordionDemoCtrl', function ($scope) {
        $scope.oneAtATime = true;
        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
    });
})();