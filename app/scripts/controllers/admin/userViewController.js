'use strict';
console.log('o000000000000000');

angular.module('origApp.controllers')
  .controller('userViewController', ['$state','$scope', 'HttpResource','$stateParams', function($state,$scope, HttpResource,$stateParams) {

	console.log('$stateParams');
	console.log($stateParams);

	$scope.isTabActive = function (stateKey) {
      return $state.includes('app.admin.user.' + stateKey);
  };

}]);