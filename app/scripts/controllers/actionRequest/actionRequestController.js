'use strict';
angular.module('origApp.controllers')


.controller('actionRequestController', function($scope,HttpResource) {

HttpResource.model('actionrequests/').customGet('', {}, function(data) {
      $scope.lists=data.data.objects;
    }, function(err) {});

$scope.status = {
    isopen: false
  };

$scope.callModal=function(id){
 HttpResource.model('actionrequests/'+id+'').customGet('',{},function(data){

    console.log(data);
 })

};
});
