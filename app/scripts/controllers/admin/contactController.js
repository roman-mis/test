var app = angular.module('origApp.controllers');

app.controller('contactController',['$scope', '$location', 'HttpResource', '$rootScope',
	function($scope, $location, HttpResource, $rootScope){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
                              {link: '/admin/home', text: 'Admin'},
                              {link: '/admin/company_profile/contact', text: 'Company Profile'}
                              // {link: '/admin/home/company_profile/contact', text: 'Contact'}
                              ];
}]);