var app = angular.module('origApp.controllers');

app.controller('contactController',['$scope', '$location', 'HttpResource', '$rootScope',
	function($scope, $location, HttpResource, $rootScope){

    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
                              {link: '/admin/home', text: 'Admin'},
                              {link: '/admin/company_profile/contact', text: 'Company Profile'}
                              ];

    // var Session = $resource('api/adminCompanyProfileContact/:id', {}, {
				// 	   	update: {
				// 	      method: 'PUT'
				// 	    }
				// 	});

    $scope.contact = {
    					companyName: null,
    					address1: null,
    					address2: null,
    					town: null,
    					country: null,
    					postCode: null,
    					tel: null,
    					fax: null,
    					email: null
    				};

    var acAPI = HttpResource.model('admin/companyProfile/contact');

    $scope.save = function(){
    	console.log($scope.contact);
    	acAPI.query({}, function(data) {
    		console.log(data);
    	});
    }

}]);