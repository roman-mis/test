'use strict';
var app = angular.module('origApp.controllers');
app.controller('PayrollHomeController',['$state', '$rootScope', '$scope', 'HttpResource', 'ModalService','payroll',
	function($state,$rootScope){	
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
                          {link: '/payroll/home', text: 'Payroll'}
                          ];
}]);
