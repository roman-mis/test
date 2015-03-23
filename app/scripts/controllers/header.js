'use strict';

angular.module('origApp.controllers')
.controller('HeaderController', function($scope, $rootScope, AuthService,userPermissions) {
	$scope.logout = function(){
		AuthService.doLogout();
	};
	$scope.currentUser = AuthService.getCurrentUser();
	// $state.go('contact.detail')
	$scope.r={};
	$scope.permissions = userPermissions.permissions;

});