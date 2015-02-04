'use strict';
angular.module('origApp.controllers')
        .controller('AgencySidebarController', function($scope, ModalService) {
          $scope.openAddAgencyWin = function() {
            ModalService.open({
              templateUrl: 'views/agency/_modal_agency.html',
              parentScope: $scope,
              controller: 'AgencyEditController'
            });
          };
        });






