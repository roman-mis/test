'use strict';
console.log(1)
var app = angular.module('origApp.controllers');
app.controller('createValidationController',['$state', '$rootScope', '$scope', 'HttpResource', 'ModalService','payroll',
	function($state,$rootScope,$scope,HttpResource,ModalService,payroll){	

		HttpResource.model('timesheets').customGet('',{},function(timeSheetsData){
    	console.log('done !!');
      console.log(timeSheetsData);
	});
}]);
