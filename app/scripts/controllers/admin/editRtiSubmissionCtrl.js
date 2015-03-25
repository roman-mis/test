'use strict';

angular.module('origApp.controllers')
.controller('editRtiSubmissionCtrl', function($scope,HttpResource,$modalInstance,parentScope){
   $scope.rti = jQuery.extend({},parentScope.rti);
   $scope.delete = function  () {
     $scope.rti = {};
   };
   $scope.log = function () {
     console.log($scope.rti);
   };
   $scope.save = function () {
     HttpResource.model('systems').create($scope.rti).patch('rti').then(function (res) {
      parentScope.rti = jQuery.extend({},$scope.rti);
     console.log(res);
     $modalInstance.close();
   });
   };
   
});