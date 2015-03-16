'use strict';
angular.module('origApp.controllers')
        .controller('AgencyMainController', function($scope, $rootScope, $state, $stateParams, HttpResource,ModalService) {
          $scope.selectedAgencyId = $stateParams.agencyId;

          var agencyAPI = HttpResource.model('agencies');

          //main breadcrumbs
          $scope.baseBreadcrumbs = [
            {link: '/', text: 'Home'},
            {link: '/agencies', text: 'Agencies'},
            {link: '/agencies/' + $scope.selectedAgencyId, text: ''}
          ];
          $scope.selectedAgency = null;

          $scope.$watch('selectedAgency', function(){
            $scope.baseBreadcrumbs[2].text = $scope.selectedAgency.name;
            $rootScope.breadcrumbs = $scope.baseBreadcrumbs;
          }, true);

          //load agency basic information
          $scope.loadAgency = function() {
            $scope.selectedAgency = agencyAPI.get($scope.selectedAgencyId);
          };

          $scope.addNewAgency = function() {
            console.log(111111111111111112)
            ModalService.open({
              templateUrl: 'views/agency/_modal_agency.html',
              parentScope: $scope,
              controller: 'AgencyEditController'
            });
          };

          $scope.addSubBreadcrumb = function(crumb) {
            var ary = JSON.parse(JSON.stringify($scope.baseBreadcrumbs));
            if (crumb) {
              ary.push(crumb);
            }
            $rootScope.breadcrumbs = ary;
          };

          $scope.loadAgency();

          $scope.isTabActive = function(stateKey) {
            return $state.includes('app.agency.' + stateKey);
          };


          $scope.tab = {isMenuCollapsed: true, caption: 'Home'};
          jQuery(document).on('click', '.candidate-tabs a', function() {
            var that = this;
            $scope.$apply(function() {
              $scope.tab.caption = $(that).text();
              $scope.tab.isMenuCollapsed = true;
            });
          });


          $rootScope.$on('agencyUpdated', function(e, info) {
            if (info.agency._id === $scope.selectedAgencyId) {
              $scope.selectedAgency = info.agency;
            }
          });

        });