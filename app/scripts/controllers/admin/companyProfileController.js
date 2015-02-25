var app = angular.module('origApp.controllers');

app.controller('companyProfileController',['$scope', '$rootScope', 'CompanyProfileService', 'HttpResource',
	function($scope, $rootScope, CompanyProfileService, HttpResource){

		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/company_profile/contact', text: 'Company Profile'}
		];

		$scope.companyProfile = {
			contact: {},
			accounts: {},
			bankDetails: {},
			defaults: {}
		};
		var docId = null;

		// get dropdowns from the server
		CompanyProfileService.getDropDownData().then(function(data){
			console.log('dropdown')
			$scope.dropDownLists = data;
            $scope.companyProfile.defaults.payFrequency = $scope.dropDownLists.payFrequency[0].code;
            $scope.companyProfile.defaults.holidayPayRule = $scope.dropDownLists.holidayPayRule[0].code;
            $scope.companyProfile.defaults.paymentMethod = $scope.dropDownLists.paymentMethod[1].code;
            $scope.companyProfile.defaults.adminFee = $scope.dropDownLists.adminFee[0].code;
            $scope.companyProfile.defaults.derogationContract = $scope.dropDownLists.derogationContract[2].code;
            $scope.companyProfile.defaults.communicationMethod = $scope.dropDownLists.communicationMethod[0].code;
            $scope.companyProfile.defaults.contractorStatus = $scope.dropDownLists.contractorStatus[2].code;
		});
		
		// get company profile from the server
		CompanyProfileService.getCompanyProfile().then(function(data){
			console.log('companyProfile')
			$scope.companyProfile = data.companyProfile;
			docId = data._id;
		}, function(){
			console.log('!companyProfile')
		});

		$scope.save = function(){
			console.log($scope.companyProfile);
			CompanyProfileService.saveCompanyProfile($scope.companyProfile, docId);
		};

	}]);