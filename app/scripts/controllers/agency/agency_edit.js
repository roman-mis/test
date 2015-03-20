'use strict';

angular.module('origApp.controllers')
        .controller('AgencyEditController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, $rootScope, MsgService) {
          $scope.countries = ConstantsResource.get('countries');
          $scope.status = parentScope.selectedAgency.status;
          $scope.fields = [
            { name: 'name', label: 'Name', required: ($scope.status == 'Live' || $scope.status == 'Submitted') ? true : false },
            { name: 'address1', label: 'Address 1', required: ($scope.status == 'Live') ? true : false },
            {name: 'address2', label: 'Address 2'},
            {name: 'address3', label: 'Address 3'},
            { name: 'town', label: 'Town', required: ($scope.status == 'Live') ? true : false },
            {name: 'country', label: 'Country'},
            { name: 'postCode', label: 'Postcode', required: ($scope.status == 'Live') ? true : false },
            { name: 'companyRegNo', label: 'Company Reg No.', required: ($scope.status == 'Live') ? true : false },
            { name: 'companyVatNo', label: 'Company VAT No.', required: ($scope.status == 'Live') ? true : false }
          ];
          $scope.data = {};

          if (parentScope.agency) {
            $scope.fields.forEach(function(item) {
              $scope.data[item.name] = parentScope.agency[item.name];
            });
          }

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };

          $scope.ok = function() {
            var successCallback = function(response) {
              $scope.isSaving = false;
              if (!HttpResource.flushError(response)) {
                if(parentScope.agency){
                  parentScope.agency = jQuery.extend(parentScope.agency, $scope.data);
                  $rootScope.$broadcast('agencyUpdated', {agency: parentScope.agency});
                }else{
                  $rootScope.$broadcast('newAgencyAdded', {agency: HttpResource.model('agencies').create(response.data.object)});
                  MsgService.success('New agency has been added.');
                }
                $modalInstance.close();
              }
            };
            $scope.isSaving = true;
            if (parentScope.agency) {
              HttpResource.model('agencies').create($scope.data)
                      .patch(parentScope.agencyId)
                      .then(function(response) {
                        successCallback(response);
                      });
            } else {
              HttpResource.model('agencies').create($scope.data)
                      .post()
                      .then(function(response) {
                        successCallback(response);
                      });
            }

          };
        });