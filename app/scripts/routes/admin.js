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
	.state('app.admin.templates', {
		url: '/templates',
		templateUrl: 'views/admin/templates.html'
	})
	.state('app.admin.company_profile', {
		url: '/company_profile',
		templateUrl: 'views/admin/company_profile.html'
	});
});