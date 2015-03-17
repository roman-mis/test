'use strict';
angular.module('origApp').config(function ($stateProvider) {
    $stateProvider

    .state('app.activity', {
        url: '/activity',
        templateUrl: 'views/activity/expensesAuthorization.html',
        controller: 'expensesAuthorizationCtrl'
    })
    .state('app.activity.home', {
        url: '/home',
        templateUrl: 'views/activity/activityHome.html',
    })
    .state('app.activity.expensesAuthorization', {
        url: '/expensesAuthorization',
        templateUrl: 'views/activity/expensesAuthorization.html',
        controller: 'expensesAuthorizationCtrl'
    });

});