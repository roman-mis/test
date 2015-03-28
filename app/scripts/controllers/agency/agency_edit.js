'use strict';

angular.module('origApp.controllers')
        .controller('AgencyEditController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, $rootScope, MsgService) {
          $scope.countries = ConstantsResource.get('countries');
          // $scope.status = 'Submitted';
          HttpResource.model('constants/agencyStatus').query({},function (res) {
            console.log(res);
            $scope.agencyStatus = res.data;
          });
          HttpResource.model('constants/countries').query({},function  (res) {
            $scope.countries = res.data;
            
          });
          $scope.data = {};

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