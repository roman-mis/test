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
	.state('app.admin.company_profile', {
		url: '/company_profile',
		templateUrl: 'views/admin/company_profile/index.html',
		controller: 'companyProfileController'
	})
	.state('app.admin.company_profile.contact', {
		url: '/contact',
		templateUrl: 'views/admin/company_profile/partials/contact.html',
		controller: 'contactController'
	})
    .state('app.admin.company_profile.accounts', {
		url: '/accounts',
		templateUrl: 'views/admin/company_profile/partials/accounts.html',
		controller: 'accountsController'
	})
	.state('app.admin.company_profile.bank_details', {
		url: '/bank_details',
		templateUrl: 'views/admin/company_profile/partials/bank_details.html',
		controller: 'bankDetailsController'
	})
	.state('app.admin.company_profile.defaults', {
		url: '/defaults',
		templateUrl: 'views/admin/company_profile/partials/defaults.html',
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
        .state('app.admin.paymentRates', {
            url: '/paymentrates',
            templateUrl: 'views/admin/payment_rates/index.html',
            controller: 'PaymentRatesController'
        })
	.state('app.admin.hmrc.expensesRate', {
		url: '/expensesRates',
		templateUrl: 'views/admin/expensesRate.html',
		controller: 'expensesRateController'
	});
});
