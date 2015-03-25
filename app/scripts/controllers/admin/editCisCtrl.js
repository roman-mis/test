'use strict';
angular.module('origApp.controllers')

.controller('editCisCtrl',['$scope', 'HttpResource','parentScope','$modalInstance',
  function($scope, HttpResource, parentScope, $modalInstance){
    $scope.cis = jQuery.extend({},parentScope.cis);
    $scope.delete = function () {
      $scope.cis = {};
    };
    $scope.save = function () {
     HttpResource.model('systems').create($scope.cis).patch('cisverification').then(function (res) {
      parentScope.cis = jQuery.extend({},$scope.cis);
     console.log(res);
     $modalInstance.close();
   });
   };
}]);