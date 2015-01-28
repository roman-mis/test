'use strict';
angular.module('origApp.controllers')
        .controller('CandidateContactController', function($scope, $stateParams, HttpResource, ConstantsResource, ModalService, MsgService) {

          //define public properties and functions
          $scope.candidateId = $stateParams.candidateId;
          $scope.nationalities = ConstantsResource.get('nationalities');

          $scope.getNationality = function(code) {
            var na = $scope.nationalities.filter(function(val) {
              return val.code == code;
            });
            if (na.length == 0) {
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
            $scope.bankDetail = candidateResource.get('bankdetail');
          }

          //share this data over all sub pages
          $scope.addSubBreadcrumb({'text': 'Contact'});

          loadContactDetail();
          loadBankDetail();
        })

        // edit primary contact information
        .controller('_EditPrimaryContactController', function($scope, $modalInstance, parentScope, HttpResource) {
          $scope.fields = [
            {name: 'phone', label: 'Phone'},
            {name: 'mobile', label: 'Mobile'},
            {name: 'emailAddress', label: 'Email', type: 'email'},
            {name: 'altEmail', label: 'Alt.Email', type: 'email'},
            {name: 'facebook', label: 'Facebook'},
            {name: 'linkedin', label: 'Linkedin'}
          ];
          $scope.data = {};

          $scope.fields.forEach(function(item) {
            $scope.data[item.name] = parentScope.contactDetail[item.name];
          });

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
          $scope.fields = [
            {name: 'address_1', label: 'Address 1'},
            {name: 'address_2', label: 'Address 2'},
            {name: 'address_3', label: 'Address 3'},
            {name: 'nationality', label: 'Nationality'}
          ];
          $scope.data = {};
          $scope.nationalities = parentScope.nationalities;

          $scope.fields.forEach(function(item) {
            $scope.data[item.name] = parentScope.contactDetail[item.name];
          });

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

        // edit bank details
        .controller('_EditBankDetailsController', function($scope, $modalInstance, parentScope, HttpResource) {
          $scope.fields = [
            {name: 'accountName', label: 'Name on Account'},
            {name: 'bankName', label: 'Bank Name'},
            {name: 'accountNo', label: 'Account No.'},
            {name: 'sortCode', label: 'Sort Code'},
            {name: 'bankRollNo', label: 'Bankroll No.'}
          ];
          $scope.data = {};

          $scope.fields.forEach(function(item) {
            $scope.data[item.name] = parentScope.bankDetail[item.name];
          });

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
