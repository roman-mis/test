'use strict';
angular.module('origApp.controllers')
.controller('ExpenseRatesController', function($scope, $rootScope) {
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/expense_rates', text: 'Expense Rates'}
    ];
});