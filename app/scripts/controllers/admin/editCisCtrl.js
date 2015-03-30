'use strict';
angular.module('origApp.controllers')

.controller('editCisCtrl',['$scope', 'HttpResource','parentScope','$modalInstance','Notification',
  function($scope, HttpResource, parentScope, $modalInstance,Notification){
    $scope.cis = angular.copy(parentScope.cis);
    $scope.delete = function () {
      $scope.cis = {};
    };
    $scope.save = function () {
      if(Object.keys($scope.cis).length ===0){
        Notification.error({message:'Fields can\'t be blank',delay:2000});
      }
      else{
        
     HttpResource.model('systems').create($scope.cis).patch('cisverification').then(function () {
      parentScope.cis = angular.copy($scope.cis);
     $modalInstance.close();
   });
      }
   };
}]);