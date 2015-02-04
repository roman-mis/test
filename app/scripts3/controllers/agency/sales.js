'use strict';

angular.module('origApp.controllers')
        .controller('AgencySalesController', function($scope, $stateParams, HttpResource, ConstantsResource, $rootScope, MsgService) {
          $scope.agencyId = $stateParams.agencyId;
          
          $scope.data = {};
          
          function loadAgencySales() {
            $scope.data = HttpResource.model('agencies/' + $scope.agencyId).get('sales');
          }

          $scope.save = function() {
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
            HttpResource.model('agencies/' + $scope.agencyId).create($scope.data)
                    .patch('sales')
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        MsgService.success('Sales information has been saved');
                      }
                    });

          };
          
          loadAgencySales();
        });