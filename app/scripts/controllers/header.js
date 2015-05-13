'use strict';

angular.module('origApp.controllers')
.controller('HeaderController', function($scope, $rootScope, AuthService,userPermissions ,ModalService) {
	$scope.logout = function(){
		AuthService.doLogout();
	};

	$scope.currentUser = AuthService.getCurrentUser();
	// $state.go('contact.detail')
	$scope.r={};
	$scope.permissions = userPermissions.permissions;

	$scope.myProfile = function () {
		ModalService.open({
			parentScope: $scope,
			controller: 'myProfileController',
			templateUrl: '/views/partials/myprofile.html',
			size:'lg'
		});
	};
	

});