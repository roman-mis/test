'use strict';
var app = angular.module('origApp.controllers');

app.controller('companyProfileController',['$scope', '$rootScope', 'CompanyProfileService','$state','ModalService','closeProfile',
	function($scope, $rootScope, CompanyProfileService,$state, ModalService,closeProfile){
        
		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
			{link: '/admin/home', text: 'Admin'},
			{link: '/admin/companyProfile/contact', text: 'Company Profile'}
		];

		$scope.companyProfile = {};
		$scope.tab = 'contact';

		// get dropdowns from the server
		CompanyProfileService.getDropDownData().then(function(data){
			$scope.dropDownLists = data;
		});
		
		// get company profile from the server
		CompanyProfileService.getCompanyProfile().then(function(data){
			if(data.companyProfile){
				$scope.companyProfile =data.companyProfile.companyProfile;
				console.log('company profile.....');
				console.log($scope.companyProfile);
			}

		});
		 $scope.isTabActive = function(stateKey) {
            return $state.includes('app.admin.' + stateKey);
          };

		$scope.openCompanyProfileContact = function () {
                $scope.closeProfile=ModalService.open({
                    templateUrl: 'views/admin/companyProfile/partials/_edit_contact.html',
                    parentScope: $scope,
                    controller: 'companyProfileController'
                });
                closeProfile.setValue($scope.closeProfile);
        };

	   $scope.openCompanyProfileAccounts = function () {
                $scope.closeProfile=ModalService.open({
                    templateUrl: 'views/admin/companyProfile/partials/_edit_accounts.html',
                    parentScope: $scope,
                    controller: 'companyProfileController'
                });
                closeProfile.setValue($scope.closeProfile);
        };

      

        $scope.openCompanyProfileBankDetails = function () {
                $scope.closeProfile=ModalService.open({
                    templateUrl: 'views/admin/companyProfile/partials/_edit_bankDetails.html',
                    parentScope: $scope,
                    controller: 'companyProfileController'
                });
                closeProfile.setValue($scope.closeProfile);
        };

        $scope.openCompanyProfileDefaults = function () {
                $scope.closeProfile=ModalService.open({
                    templateUrl: 'views/admin/companyProfile/partials/_edit_defaults.html',
                    parentScope: $scope,
                    controller: 'companyProfileController'
                });
                closeProfile.setValue($scope.closeProfile);
        };


        $scope.saveContact = function(){   
               	CompanyProfileService.saveCompanyProfile($scope.companyProfile,'contact');
               	closeProfile.returnValue().dismiss();
		};

		$scope.saveAccounts=function(){ 	
            CompanyProfileService.saveCompanyProfile($scope.companyProfile, 'accounts');
            closeProfile.returnValue().dismiss();           
        };


		$scope.saveBankDetails = function(){   
               	CompanyProfileService.saveCompanyProfile($scope.companyProfile,'bankDetails');
               	closeProfile.returnValue().dismiss();
		};

		$scope.saveDefaults = function(){   
               	CompanyProfileService.saveCompanyProfile($scope.companyProfile,'defaults');
               	closeProfile.returnValue().dismiss();
		};


        $scope.closeProfileFunction=function(){
        	closeProfile.returnValue().dismiss();
        };


        $rootScope.$on('profileSave',function(event, data, tab){
         	console.log('tab getting:' +tab);
         	if(tab==='contact'){
			   $scope.companyProfile.contact=data;
			  }else if(tab==='accounts'){
			    $scope.companyProfile.accounts=data;
			  }else if(tab ==='bankDetails'){
			    $scope.companyProfile.bankDetails=data;
			  }else if(tab ==='defaults'){
			    $scope.companyProfile.defaults=data;
			  }
        });

	}]);