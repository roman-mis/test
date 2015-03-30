'use strict';
angular.module('origApp.controllers')
  .controller('userHomeController', ['$scope','Notification', 'HttpResource','$stateParams','$rootScope', function($scope,Notification, HttpResource,$stateParams,$rootScope) {
		
		$scope.user = {_id:'',firstName:'',lastName:''};
		

	console.log('$stateParams');
	console.log($stateParams);
	HttpResource.model('constants/userTypes').customGet('',{},function(data){
		$scope.types = data.data;
	});

	HttpResource.model('users/'+$stateParams.id).customGet('',{},function(data){
		console.log(data);
		$scope.user = data.data.object;
		console.log('/admin/users/'+$scope.user._id+'/home')
		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
                              {link: '/admin/home', text: 'Admin'},
                              {link: '/admin/users', text: 'Users'},
                              {link: '/admin/user/'+$scope.user._id+'/home', text: ''+$scope.user.firstName+' '+$scope.user.lastName}
                              ];
	});

	$scope.update = function(){
		console.log($scope.user.firstName);
		if(!$scope.user.firstName || $scope.user.firstName === ''){
			Notification.error({message:'First Name is required',delay:2000});
			return ;
		}
		
		if(!$scope.user.lastName || $scope.user.lastName === ''){
			Notification.error({message:'Last Name is required',delay:2000});
			return ;
		}

		if(!$scope.user.emailAddress || $scope.user.emailAddress === ''){
			Notification.error({message:'E-mail Address is required',delay:2000});
			return ;
		}
		if(!$scope.user.userType || $scope.user.userType === ''){
			Notification.error({message:'User Type is required',delay:2000});
			return ;
		}

		$scope.user.id = $scope.user._id;
		HttpResource.model('users/update/'+$scope.user._id).create($scope.user).post().then(function(data){
			console.log(data);
			// $scope.types = data.data;
		});

	};
}]);