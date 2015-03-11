'use strict';
angular.module('origApp.controllers')
.controller('expensesRateController', ['$scope', '$timeout', '$rootScope', 'HttpResource', function($scope, $timeout, $rootScope,HttpResource){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/expensesRate', text: 'Expenses Rate'}
    ];   

}]);