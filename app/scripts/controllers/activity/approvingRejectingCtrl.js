'use strict';
var app = angular.module('origApp.controllers');

app.controller('approvingRejectingCtrl', function ($scope, $modalInstance, $http, item, ids, approve) {
    $scope.items = item;
    $scope.title = approve ? 'Approving' : 'Rejecting';
    $scope.approve = approve;
    $scope.ids = ids;
    //console.log(item);

    $scope.ok = function () {
        if (approve) {
            var req = {};
            req.expenseIds = [];
            $scope.items.forEach(function (item) {
                req.expenseIds.push(item._id);
            });
            //console.log(req);
            $http.patch('/api/candidates/expenses/approve', req).success(function (res) {
                //console.log(res);
            });
            if (false) {
                $http.patch('/api/candidates/expenses/notifyApprove', req).success(function (res) {
                    //console.log(res);
                });
            }
        } else {
            var req = {};
            req.expenseIds = [];
            $scope.items.forEach(function (item) {
                req.expenseIds.push(item._id);
            });
            //console.log(req);
            $http.patch('/api/candidates/expenses/reject', req).success(function (res) {
                //console.log(res);
            });
            if (false) {
                $http.patch('/api/candidates/expenses/notifyReject', req).success(function (res) {
                    //console.log(res);
                });
            }
        }
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});