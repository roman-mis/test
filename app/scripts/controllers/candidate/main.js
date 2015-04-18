'use strict';
angular.module('origApp.controllers')
        .controller('CandidateMainController', function($scope, $rootScope, $state, $stateParams, HttpResource,$http) {
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

          HttpResource.model('candidates/'+$scope.candidateId+'/contactdetail').query({},function (res) {
              $scope.candidate.status = res.data.object.status;
              $scope.candidate.gender = res.data.object.gender;
            console.log('status', $scope.candidate.status)
          });
          HttpResource.model('constants/candidateStatus').query({},function (res) {
            $scope.candidateStatus = res.data;
            // $scope.candidate.status

            $scope.editCandidateStatus = function () {
              console.log($scope.candidate.status);
              console.log($scope.candidateId);
              HttpResource.model('candidates/updateStatus').create($scope.candidate)
              .patch($scope.candidateId).then(function (res) {
                console.log(res);
              });
            };
          });

          // $scope.url = '/api/candidates/' + $scope.candidateId;
          // $scope.$watch('candidate.status',function (newVal) {
          //   console.log(newVal);
          //   $http({method: 'PATCH', url: $scope.url, data:newVal}).
          //   success(function(data, status) {
          //     $scope.status = status;
          //     console.log(data);
          //   }).
          //   error(function(data, status) {
          //     $scope.data = data || 'Request failed';
          //     $scope.status = status;
          //   });
          // });

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
