'use strict';

angular.module('origApp.controllers')
.controller('editRtiSubmissionCtrl',['$scope','HttpResource','$modalInstance','parentScope','Notification',
 function($scope,HttpResource,$modalInstance,parentScope,Notification){
   $scope.rti = angular.copy(parentScope.rti);
   $scope.delete = function  () {
     $scope.rti = {};
   };
   $scope.log = function () {
     console.log($scope.rti);
   };
   $scope.save = function () {
    if(Object.keys($scope.rti).length===0){
      Notification.error({message:'Fields can\'t be blank.',delay:2000});
    }
    else{
     HttpResource.model('systems').create($scope.rti).patch('rti').then(function (res) {
      parentScope.rti = angular.copy($scope.rti);
     console.log(res);
     $modalInstance.close();
   });
   }
   };
   
}]);