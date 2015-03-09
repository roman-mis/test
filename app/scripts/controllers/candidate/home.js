'use strict';
angular.module('origApp.controllers')
        .controller('CandidateHomeController', function($scope, $stateParams,HttpResource) {
          $scope.candidateId = $stateParams.candidateId;


          HttpResource.model('candidates/'+$scope.candidateId+'/payrollProduct').customGet('',{},function(data){
    
            $scope.payrollProduct = data.data.objects;
		  });
          HttpResource.model('candidates/'+$scope.candidateId+'/contactdetail').customGet('',{},function(data){
              console.log(data);
              $scope.contactdetail=data.data.object;
          },function(err){


          })

          //share this data over all sub pages
          $scope.addSubBreadcrumb(null);
        });
