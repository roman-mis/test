'use strict';
angular.module('origApp.controllers')


.controller('actionRequestController', function($scope,HttpResource,ModalService) {

HttpResource.model('actionrequests').customGet('', {}, function(data) {
      $scope.lists=data.data.objects;
      console.log($scope.lists);
    }, function(err) {});

    $scope.status = {
        isopen: false
      };

$scope.callModal=function(id,type,createdBy){
  HttpResource.model('actionrequests/'+id+'').customGet('',{},function(data){
   var controller;
   var parentScope={};
   parentScope.candidate={};
   parentScope.candidate.firstName=createdBy.name;
   parentScope.candidate.id=createdBy.id;
   parentScope.candidateId=createdBy.id;
   parentScope.showMe=true;
  console.log(data.data.objects);
   switch(type){
     case 'ssp':
       $scope.ssp=data.data.objects;
       controller='sspController';

       break;
     case 'smp':
       $scope.smpObject={};
       $scope.smpObject.startDate=data.data.objects.startDate;
       $scope.smp.smp=data.data.objects.smp;
       controller='smpController';
       break;

   }
   ModalService.open({
     templateUrl: 'views/actionRequest/'+type+'.html',
     parentScope:parentScope,
     scope: $scope,
     controller:controller,
     size: 'lg'
   });

   });

};
});
