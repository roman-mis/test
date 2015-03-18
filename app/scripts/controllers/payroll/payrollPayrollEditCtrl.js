'use strict';
var app = angular.module('origApp.controllers');

app.controller('payrollPayrollEditCtrl', function ($scope, $modalInstance, item) {
    $scope.item = item;
    //console.log(item);
    
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});