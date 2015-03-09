'use strict';
angular.module('origApp.controllers')
        .controller('CandidateHomeController', function($scope, $stateParams,HttpResource) {
          $scope.candidateId = $stateParams.candidateId;


          HttpResource.model('candidates/'+$scope.candidateId+'/payrollProduct').customGet('',{},function(data){
<<<<<<< HEAD
    
=======
          	console.log('done !!');
            console.log(data);
>>>>>>> 5595944ef7318b5fa42075948c2b7afb8cdd69c2
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
