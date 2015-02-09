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
		templateUrl: 'views/admin/templates.html',
		controller: 'templatesController'
	})
	.state('app.admin.company_profile', {
		url: '/company_profile',
		templateUrl: 'views/admin/company_profile/company_profile.html'
	})
	.state('app.admin.company_profile.contact', {
		url: '/contact',
		templateUrl: 'views/admin/company_profile/partials/contact.html'
	}).state('app.admin.company_profile.accounts', {
		url: '/accounts',
		templateUrl: 'views/admin/company_profile/partials/accounts.html'
	})
	.state('app.admin.company_profile.bank_details', {
		url: '/bank_details',
		templateUrl: 'views/admin/company_profile/partials/bank_details.html'
	})
	.state('app.admin.company_profile.defaults', {
		url: '/defaults',
		templateUrl: 'views/admin/company_profile/partials/defaults.html'
	})
	.state('app.admin.addNew', {
    url: '/add_new/:type',
    controller:'addNewController',
    templateUrl: 'views/admin/newTemplate.html'
  });;
});