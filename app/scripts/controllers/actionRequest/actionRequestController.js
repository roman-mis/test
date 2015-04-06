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
    console.log('from data');
    console.log(data.data.object);
// return;
   var controller;
   var parentScope={};
   parentScope.candidate={};
   parentScope.candidate.firstName=createdBy.name;
  // parentScope.candidate.id=createdBy.id;
  console.log(parentScope);
   parentScope.candidateId=createdBy.id;
   switch(type){
     case 'ssp':
       parentScope.showMe=true;
       $scope.ssp=data.data.objects;
       controller='sspControllers';

       break;
     case 'smp':

       controller='smpController';
       $scope.smpObject={};
       $scope.smpObject.startDate=data.data.object.startDate;
       $scope.smpObject.smp=data.data.object.smp;
       $scope.smpObject.id=data.data.object.id;
       $scope.smpObject.intendedStartDate=data.data.object.intendedStartDate;
       $scope.smpObject.days=data.data.object.days;
       $scope.smpObject.imageUrl=data.data.object.imageUrl;
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
