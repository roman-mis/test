'use strict';
// inject allUsers, HttpResource to use more functionality 
angular.module('origApp.controllers')
.controller('HmrcController', function($scope, $rootScope) { 
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
      {link: '/admin/home', text: 'Admin'},
      {link: '/admin/hmrc', text: 'HMRC'}
    ];

    $scope.dataLoaded = false;

    //if(allUsers.details.length === 0){
    //	console.log('rti first');
    //	HttpResource.model('candidates').customGet('',{},function(data){
	//			allUsers.details = data.data.objects;
	//			$scope.allUsers = data.data.objects;
	//			$scope.dataLoaded = true;
	//	  });
    //}else{
    //	console.log('rti not first');
    //	$scope.allUsers = allUsers.details;
    //	$scope.dataLoaded = true;
    //}

    //$scope.select = function(id){
    //	for(var i = 0; i < $scope.allUsers.length; i++){
    //		if($scope.allUsers[i]._id === id){
    //			$scope.user = $scope.allUsers[i];
    //		}
    //	}
    //};

});