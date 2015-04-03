'use strict';
angular.module('origApp.controllers')


.controller('actionRequestController', function($scope,HttpResource,ModalService) {


    HttpResource.model('actionrequests').customGet('',{},function(data){

      console.log(data);
    },function(err){
      console.log(err);
    });


    $scope.status = {
        isopen: false
      };

$scope.callModal=function(id,type){
  console.log(type);
 HttpResource.model('actionrequests/'+id+'').customGet('',{},function(data){
   $scope.parentScope=data.data.objects;
   ModalService.open({
     templateUrl: 'views/actionRequest/'+type+'.html',
     scope: $scope,
     size: 'lg'
   });

   });

};
});
