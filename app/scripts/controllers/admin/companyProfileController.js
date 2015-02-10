var app = angular.module('origApp.controllers');

app.controller('companyProfileController',['$scope', '$location', 'HttpResource', '$rootScope',
	function($scope, $location, HttpResource, $rootScope){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
                              {link: '/admin/home', text: 'Admin'},
                              {link: '/admin/company_profile/contact', text: 'Company Profile'}
                              ];
}]);