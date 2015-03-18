'use strict';
angular.module('origApp.controllers')
        .controller('CandidateMainController', function($scope, $rootScope, $state, $stateParams, HttpResource) {
          $scope.candidateId = $stateParams.candidateId;

          var cddAPI = HttpResource.model('candidates');

          //main breadcrumbs
          $scope.baseBreadcrumbs = [
            {link: '/', text: 'Home'},
            {link: '/candidates', text: 'Candidates'},
            {link: '/candidates/' + $scope.candidateId, text: ''}
          ];
          $scope.candidate = null;
          //load condidate basic information
          $scope.loadCandidate = function() {
            $scope.candidate = cddAPI.get($scope.candidateId, function() {
              $scope.baseBreadcrumbs[2].text = $scope.candidate.firstName + ' ' + $scope.candidate.lastName;
              $rootScope.breadcrumbs = $scope.baseBreadcrumbs;
            });
          };

          $scope.addSubBreadcrumb = function(crumb) {
            var ary = JSON.parse(JSON.stringify($scope.baseBreadcrumbs));
            if (crumb) {
              ary.push(crumb);
            }
            $rootScope.breadcrumbs = ary;
          };

          $scope.loadCandidate();

          $scope.isTabActive = function(stateKey) {
            return $state.includes('app.candidate.' + stateKey);
          };
          
          
          $scope.tab = {isMenuCollapsed: true, caption: 'Home'};
          jQuery(document).on('click', '.candidate-tabs a', function(){
            var that = this;
            $scope.$apply(function(){
              $scope.tab.caption = $(that).text();
              $scope.tab.isMenuCollapsed = true;
            });
          });
        });
