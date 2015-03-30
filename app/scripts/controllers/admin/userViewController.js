'use strict';
console.log('o000000000000000');

angular.module('origApp.controllers')
  .controller('userViewController', ['$state','$scope', 'HttpResource','$stateParams','$rootScope', function($state,$scope, HttpResource,$stateParams,$rootScope) {

  	$rootScope.breadcrumbs = [{link:'/', text:'Home'},
                              {link: '/admin/home', text: 'Admin'},
                              {link: '/admin/users', text: 'Users'}
                              ];

	console.log('$stateParams');
	console.log($stateParams);


	$scope.isTabActive = function (stateKey) {
      return $state.includes('app.admin.user.' + stateKey);
  };

}]);