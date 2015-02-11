var app = angular.module('origApp.controllers');

app.controller('bankDetailsController',['$scope', '$location', 'HttpResource', '$rootScope',
	function($scope, $location, HttpResource, $rootScope){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
                              {link: '/admin/home', text: 'Admin'},
                              {link: '/admin/company_profile/contact', text: 'Company Profile'},
                              {link: '/admin/company_profile/bank_details', text: 'Bank Details'}
                              ];
}]);