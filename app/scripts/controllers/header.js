'use strict';

angular.module('origApp.controllers')
.controller('HeaderController', function($scope, $rootScope, AuthService, userPermissions) {
	$scope.logout = function(){
		AuthService.doLogout();
	};
	$scope.currentUser = AuthService.getCurrentUser();

	userPermissions.getUserPermission('WK').then(function(data){
		console.log(data);
	});
});