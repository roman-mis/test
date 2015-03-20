'use strict';
angular.module('origApp.controllers')
        .controller('CandidateHomeController', function($scope, $stateParams,HttpResource,ModalService) {
          $scope.candidateId = $stateParams.candidateId;


          HttpResource.model('candidates/'+$scope.candidateId+'/payrollProduct').customGet('',{},function(data){

            $scope.payrollProduct = data.data.objects;
		      });
          
          HttpResource.model('candidates/'+$scope.candidateId+'/contactdetail').customGet('',{},function(data){
              $scope.contactdetail=data.data.object;
          },function(err){


          })
        /*  HttpResource.model('candidates/'+$scope.candidateId+'/lastLog').customGet('',{},function(data){

            $scope.lastLogin=data.data.lastLogin;
          },function(err){


          }); */
          HttpResource.model('lastlog/'+$scope.candidateId+'/lastlog').customGet('',{},function(data){

            $scope.lastLogs=data.data;
          },function(err){


          });

          //share this data over all sub pages
          $scope.addSubBreadcrumb(null);

          $scope.editDetails = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_editCandidateDetails.html',
              parentScope: $scope,
              controller: 'editContactDetailsCtrl',
              size:'md'
            });
          };
        });
