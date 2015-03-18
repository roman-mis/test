'use strict';
angular.module('origApp').config(function($stateProvider) {
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
	.state('app.admin.companyProfile', {
		url: '/companyProfile',
		templateUrl: 'views/admin/companyProfile/index.html',
		controller: 'companyProfileController'
	})
	.state('app.admin.companyProfile.contact', {
		url: '/contact',
		templateUrl: 'views/admin/companyProfile/partials/contact.html',
		controller: 'contactController'
	})
    .state('app.admin.companyProfile.accounts', {
		url: '/accounts',
		templateUrl: 'views/admin/companyProfile/partials/accounts.html',
		controller: 'accountsController'
	})
	.state('app.admin.companyProfile.bankDetails', {
		url: '/bankDetails',
		templateUrl: 'views/admin/companyProfile/partials/bankdetails.html',
		controller: 'bankDetailsController'
	})
	.state('app.admin.companyProfile.defaults', {
		url: '/defaults',
		templateUrl: 'views/admin/companyProfile/partials/defaults.html',
		controller: 'defaultsController'
	})
	.state('app.admin.addNew', {
    	url: '/add_new/:type',
    	controller:'addNewController',
    	templateUrl: 'views/admin/newTemplate.html'
  	})
  	.state('app.admin.statutoryRates', {
    	url: '/statutory_rates',
    	controller:'statutoryRatesController',
    	templateUrl: 'views/admin/statutory_rates/index.html'
  	})
    .state('app.admin.hmrc', {
        url: '/hmrc',
        controller: 'HmrcController',
        templateUrl: 'views/admin/hmrc/index.html'
    })
	.state('app.admin.hmrc.cis', {
		url: '/cis',
		templateUrl: 'views/admin/hmrc/partials/cis.html',
		controller: 'CisController'
	})
	.state('app.admin.hmrc.rti', {
		url: '/rti',
		templateUrl: 'views/admin/hmrc/partials/rti.html',
		controller: 'RtiController'
	})
	.state('app.admin.hmrc.mileage', {
		url: '/mileage',
		templateUrl: 'views/admin/hmrc/partials/mileage.html',
		controller: 'MileageController'
	})
	.state('app.admin.hmrc.expensesRate', {
		url: '/expensesRates',
		templateUrl: 'views/admin/expensesRate.html',
		controller: 'expensesRateController'
	});
});
