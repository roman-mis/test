'use strict';
angular.module('origApp.controllers')
.controller('myProfileController', ['$scope', '$modalInstance', 'parentScope', 'HttpResource','$upload', '$http', 'MsgService','ModalService', '$rootScope',
	function($scope, $modalInstance, parentScope, HttpResource, $upload, $http, MsgService, ModalService, $rootScope){
		$scope.profile = {};
		//getting my copy of user cuz session copy overrides everything when page refreshes
		HttpResource.model('users/'+parentScope.currentUser._id).query({},function (res) {
			console.log(res);
			$scope.user = res.data.object;
			console.log($scope.user);

			HttpResource.model('documents/'+parentScope.currentUser._id+'/avatar').customGet('viewsignedurl', {
				fileName: $scope.user.avatarFileName
			},function(res){
				console.log(res);
				$scope.avatar = res.data.signedRequest;
			});
		});
		$scope.comparePasswords = function () {
			if(($scope.profile.newPassword && $scope.profile.confirmPassword)&&$scope.profile.newPassword !== $scope.profile.confirmPassword){
				$scope.noMatch = true;
				$scope.disableForm = true;
				return {noMatch:$scope.noMatch,disableForm:$scope.disableForm};
			}else{
				$scope.noMatch = false;
				$scope.disableForm = false;
				return {noMatch:$scope.noMatch,disableForm:$scope.disableForm};
			}

		};
		$scope.onFileSelect = function (files) {
			$scope.files = files;
			console.log(files[0]);
			if($scope.files){
				$scope.user.avatarFileName=new Date().getTime().toString() + '_' + $scope.files[0].name;
			}
		};
		$scope.editEmail = function (edit,keep) {
			if(edit === true){
				$scope.backupEmail = angular.copy($scope.user.emailAddress);
			}
			if(!edit && keep){
				$scope.user.emailAddress = angular.copy($scope.backupEmail);
			}
			
		};
		$scope.save = function () {
			var object = {id:parentScope.currentUser._id,password:$scope.profile.password,newPassword:$scope.profile.newPassword,confirmPassword:$scope.profile.confirmPassword};
			if($scope.profile.password &&!$scope.noMatch){
				HttpResource.model('editprofilepassword').create(object).post()
				.then(function (res) {
					if(res.data.msg){
						$scope.wrongPassword = res.data.msg;
						MsgService.danger('Incorrect Password.');
						return;
					}
					console.log(res);
					$scope.wrongPassword = undefined;
					$modalInstance.close();
					MsgService.success('Profile updated successfully.');
				});
			}
			HttpResource.model('users/update/'+$scope.user._id)
			.create({emailAddress:$scope.user.emailAddress, avatarFileName:$scope.user.avatarFileName}).post();
			if($scope.files) {
				$scope.uploading = true;
				var fileName = $scope.user.avatarFileName;
				var mimeType = $scope.files[0].type || 'text/plain';
				$scope.isUploading = true;
				HttpResource.model('documents/'+parentScope.currentUser._id+'/avatar').customGet('signedurl', {
					mimeType: mimeType,
					fileName: fileName
				}, function(response) {
					var signedRequest = response.data.signedRequest;
					$http({
						method: 'PUT',
						url: signedRequest,
						data: $scope.files[0],
						headers: {'Content-Type': mimeType, 'x-amz-acl': 'public-read'}
					}).success(function() {
						
						$scope.files = undefined;
						
		                $scope.uploading = false;

		                HttpResource.model('documents/'+parentScope.currentUser._id+'/avatar').customGet('viewsignedurl', {
		                	fileName: $scope.user.avatarFileName
		                },function(res){
		                	console.log(res);
		                	$scope.avatar = res.data.signedRequest;
		                });
		                if(!$scope.wrongPassword){
		                	$scope.files = null;
		                	$modalInstance.close();
		                	MsgService.success('Profile updated successfully.');
		                }
		            });
				});
			}
			if(!$scope.profile.password&&!$scope.files){
				$modalInstance.close();
				MsgService.success('Profile updated successfully.');
			}
		};
		$scope.cancel = function () {
			$modalInstance.close();
		};
		console.log($rootScope)
		$scope.vehicle = function () {
			ModalService.open({
				parentScope: $scope,
				controller: 'vehicleCtrl',
				templateUrl: '/views/partials/vehicle.html',
				size:'md'
			});
		};
}]);