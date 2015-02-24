var app = angular.module('origApp.controllers');


app.controller('CubeCtrl', [ '$scope', '$rootScope', '$location' ,
	function($scope, $rootScope, $location) {

		$rootScope.breadcrumbs = [{link:'/', text:'Home'}, {link: '/admin/home', text: 'Admin'}];

		$scope.go = function(path) {
			$location.path(path);
		}

	}]);