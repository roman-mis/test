var app = angular.module('demo', ['ngRoute', 'ngAnimate']);

app.config(function ($routeProvider) {
  $routeProvider
  .when('/one', {
    templateUrl:'page1.html'
  })
  .when('/two', {
    templateUrl:'page2.html'
  })
   .when('/three', {
    templateUrl:'page3.html'
  })
  .otherwise({
    redirectTo:'/one'
  });
});

app.controller('CubeCtrl', function($scope, $rootScope, $location) {
  $rootScope.breadcrumbs = [{link:'/', text:'Home'}];
  $scope.go = function(path) {
	$location.path(path);
  }
});