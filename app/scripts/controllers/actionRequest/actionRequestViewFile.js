'use strict';
angular.module('origApp.controllers')

.controller('actionRequestViewFile', function($scope,url,$modalInstance,MsgService,fileName) {

     $scope.imageUrl=url.url;
     $scope.fileName=fileName;

     $scope.cancel=function(){

        $modalInstance.close();

     };

});
