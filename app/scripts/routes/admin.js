angular.module("origApp").config(function($stateProvider) {
	$stateProvider
	.state('app.admin', {
		url: '/admin',
		templateUrl: 'views/admin/index.html',
		controller: 'CubeCtrl'
	})
	.state('app.admin.home', {
		url: '/home',
		templateUrl: 'views/admin/home.html'
	})
	.state('app.admin.two', {
		url: '/two',
		templateUrl: 'views/admin/page2.html'
	})
	.state('app.admin.three', {
		url: '/three',
		templateUrl: 'views/admin/page3.html'
	});
});