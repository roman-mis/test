'use strict';

angular.module('origApp.controllers')
        .controller('AgencyHomeController', function($scope, $stateParams, ModalService, HttpResource, ConstantsResource, $http) {
          $scope.agencyId = $stateParams.agencyId;
          $scope.countries = ConstantsResource.get('countries');

          function loadAgency() {
            $scope.agency = HttpResource.model('agencies').get($scope.agencyId);
          }
          
          function loadAgencyContact() {
            $scope.agencyContact = HttpResource.model('agencies/' + $scope.agencyId).get('contact');
          }
          
          
          $scope.getConstant = function(constantKey, code) {
            var hashData = ConstantsResource.getHashData(constantKey);
            if(!hashData || !hashData[code]){
              return {};
            }
            return hashData[code];
          };
          
          $scope.openAgencyEdit = function() {
            ModalService.open({
              templateUrl: 'views/agency/_modal_agency.html',
              parentScope: $scope,
              controller: 'AgencyEditController'
            });
          };

          
          
          $scope.openContactEdit = function() {
            ModalService.open({
              templateUrl: 'views/agency/_agency_contact_edit.html',
              parentScope: $scope,
              controller: '_AgencyContactEditController'
            });
          };
          
          //upload company logo
          $scope.onSelectCompanyLogo = function(fileInput) {
            $scope.$apply(function() {
              $scope.agencyContact.localLogoPath = fileInput.value;
            });
          };
          
          //upload file to s3
          $scope.uploadComapnyLogo = function() {
            if(!$('#upload_company_logo').val()){
              alert('Please select a file first.');
              return;
            }
            var file = $('#upload_company_logo')[0].files[0];
            var fileName = new Date().getTime().toString() + '_' + file.name;
            var mimeType = file.type || 'text/plain';
            $scope.isLogoUploading = true;
            HttpResource.model('agencies/' + $scope.agencyId).customGet('logosignedurl', {
              mimeType: mimeType,
              fileName: fileName
            }, function(response) {
              var signedRequest = response.data.signedRequest;
              $http({
                method: 'PUT',
                url: signedRequest,
                data: file,
                headers: {'Content-Type': mimeType, 'x-amz-acl': 'public-read'}
              }).success(function() {
                HttpResource.model('agencies/' + $scope.agencyId).create({logo: fileName})
                    .patch('contact')
                    .then(function(response) {
                      $scope.isLogoUploading = false;
                      if (!HttpResource.flushError(response)) {
                        $scope.agencyContact.localLogoPath = '';
                        $scope.agencyContact.logo = fileName;
                      }
                    });
              });
            });
          };
          
          loadAgency();
          loadAgencyContact();
          
          $scope.addSubBreadcrumb(null);
          
        })

        // edit agency contact information
        .controller('_AgencyContactEditController', function($scope, $modalInstance, parentScope, HttpResource) {
          $scope.fields = [
            {name: 'phone1', label: 'Phone 1'},
            {name: 'phone2', label: 'Phone 2'},
            {name: 'fax', label: 'Fax'},
            {name: 'facebook', label: 'Facebook'},
            {name: 'linkedin', label: 'Linkedin'},
            {name: 'website', label: 'Website'},
            {name: 'email', label: 'Email', type: 'email'}
          ];
          $scope.data = {};

          if(parentScope.agencyContact){
            $scope.fields.forEach(function(item) {
              $scope.data[item.name] = parentScope.agencyContact[item.name];
            });
          }

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };

          $scope.ok = function() {
            $scope.isSaving = true;
            HttpResource.model('agencies/' + parentScope.agencyId).create($scope.data)
                    .patch('contact')
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        parentScope.agencyContact = jQuery.extend(parentScope.agencyContact, $scope.data);
                        $modalInstance.close();
                      }
                    });

          };
        });
        
        
