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
		templateUrl: 'views/admin/company_profile/company_profile.html',
		controller: 'companyProfileController'
	})
	.state('app.admin.company_profile.contact', {
		url: '/contact',
		templateUrl: 'views/admin/company_profile/partials/contact.html',
		controller: 'contactController'
	}).state('app.admin.company_profile.accounts', {
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
    .state('app.admin.paymentRate', {
        url: '/payment_rate',
        templateUrl: 'views/admin/payment_rate.html',
        controller: 'PaymentRateController'
    })
    .state('app.admin.mileageRates', {
        url: '/mileage_rates',
        templateUrl: 'views/admin/mileage_rates.html',
        controller: 'MileageRatesController'
    })
    .state('app.admin.cisVerification', {
        url: '/cis_verification',
        templateUrl: 'views/admin/cis_verification.html',
        controller: 'CISVerificationController'
    })
    .state('app.admin.rti', {
        url: '/rti',
        templateUrl: 'views/admin/rti.html',
        controller: 'RTIController'
    })
    .state('app.admin.expenseRates', {
        url: '/expense_rates',
        templateUrl: 'views/admin/expense_rates.html',
        controller: 'ExpenseRatesController'
    });
});