'use strict';
angular.module('origApp.controllers')
        .controller('CandidateContactController', function($scope, $stateParams, HttpResource, ConstantsResource, ModalService) {

          //define public properties and functions
          $scope.candidateId = $stateParams.candidateId;
          $scope.nationalities = ConstantsResource.get('nationalities');
          $scope.message = "If you would like to update your bank details, please contact Originem on <Company Phone Number> or email: <Company Email Address>"
          $scope.getNationality = function(code) {
            var na = $scope.nationalities.filter(function(val) {
              return val.code === code;
            });
            if (na.length === 0) {
              return null;
            }
            return na[0];
          };

          $scope.openPrimaryContactEdit = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_primary_contact_edit.html',
              parentScope: $scope,
              controller: '_EditPrimaryContactController'
            });
          };

          $scope.openPrimaryAddressEdit = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_primary_address_edit.html',
              parentScope: $scope,
              controller: '_EditPrimaryAddressController'
            });
          };

          $scope.openBankDetailsEdit = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_bank_details_edit.html',
              parentScope: $scope,
              controller: '_EditBankDetailsController'
            });
          };

          $scope.getCandidateResource = function() {
            return candidateResource;
          };

          //define private properties and functions
          var candidateResource = HttpResource.model('candidates/' + $scope.candidateId);

          function loadContactDetail() {
            $scope.contactDetail = candidateResource.get('contactdetail');
          }

          function loadBankDetail() {
            $scope.bankDetail = candidateResource.get('bankdetail', function(){
              console.log('hdushshfuiohsioh')
              $scope.bankDetail.hashedBankNo = $scope.replaceWithAstric($scope.bankDetail.accountNo,3);
            });
          }

          $scope.replaceWithAstric = function(info,lastShowenNo){
            var infoArr = info.split('')
            var t = ''
            for(var i = 0; i < infoArr.length - lastShowenNo; i++){
              t += '*';
            }
            for (i = infoArr.length - lastShowenNo; i < infoArr.length; i++) {
              t += infoArr[i];
            }
            return t;
          };

          //share this data over all sub pages
          $scope.addSubBreadcrumb({'text': 'Contact'});

          loadContactDetail();
          loadBankDetail();
        })

        // edit primary contact information
        .controller('_EditPrimaryContactController', function($scope, $modalInstance, parentScope, HttpResource) {
          $scope.candidate = parentScope.candidate;
          $scope.ukMobile = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
          $scope.ukPhone = /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
          $scope.emailPattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
          
          
          
          $scope.data = angular.copy(parentScope.contactDetail);


          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };



          $scope.ok = function() {
            $scope.isSaving = true;
             parentScope.getCandidateResource().create($scope.data)
                    .patch('contactdetail')
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        parentScope.contactDetail = jQuery.extend(parentScope.contactDetail, $scope.data);
                        $modalInstance.close();
                      }
                    });

          };
        })

        // edit primary address
        .controller('_EditPrimaryAddressController', function($scope, $modalInstance, parentScope, HttpResource) {
          
          $scope.data = angular.copy(parentScope.contactDetail);
          $scope.nationalities = parentScope.nationalities;
          $scope.candidate = parentScope.candidate;

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };

          $scope.ok = function() {
            $scope.isSaving = true;
            parentScope.getCandidateResource().create($scope.data)
                    .patch('contactdetail')
                    .then(function(response) {
                      console.log(response, $scope.data);
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        parentScope.contactDetail = jQuery.extend(parentScope.contactDetail, $scope.data);
                        $modalInstance.close();
                      }
                    });

          };
        })

        // edit bank details
        .controller('_EditBankDetailsController', function($scope, $modalInstance, parentScope, HttpResource) {
          
          $scope.candidate = parentScope.candidate;
          
            $scope.data = angular.copy(parentScope.bankDetail);           
         

          
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };

          $scope.ok = function() {
            $scope.isSaving = true;
            parentScope.getCandidateResource().create($scope.data)
                    .patch('bankdetail')
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        parentScope.bankDetail = jQuery.extend(parentScope.bankDetail, $scope.data);
                        $modalInstance.close();
                      }
                    });
            
            
          };
        });
