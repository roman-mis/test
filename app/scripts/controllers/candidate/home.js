'use strict';
angular.module('origApp.controllers')
        .controller('CandidateHomeController', function($scope, $stateParams,HttpResource) {
          $scope.candidateId = $stateParams.candidateId;


          HttpResource.model('candidates/'+$scope.candidateId+'/payrollProduct').customGet('',{},function(data){
          	console.log('done !!');
            console.log(data);
            $scope.payrollProduct = data.data.objects;
		  });
          //share this data over all sub pages
          $scope.addSubBreadcrumb(null);
        });
