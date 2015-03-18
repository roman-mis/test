'use strict';
angular.module('origApp.controllers')
		.controller('editContactDetailsCtrl', ['$scope', '$modalInstance', '$stateParams', 'HttpResource','parentScope',
			function($scope,$modalInstance,$stateParams, HttpResource, parentScope){
				$scope.candidateId = $stateParams.candidateId;
				console.log($scope.candidateId);

				HttpResource.model('constants/candidateStatus').query({},function (res) {
					console.log(res);
				});
				$scope.parent = parentScope;
				console.log($scope.parent);
		}]);