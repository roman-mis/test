'use strict';
var app = angular.module('origApp.controllers');

app.controller('approvingRejectingCtrl', function ($scope, $modalInstance, $http, item, ids, claimIds, approve) {
    $scope.items = item;
    $scope.title = approve ? 'Approving' : 'Rejecting';
    $scope.approve = approve;
    $scope.ids = ids;
    $scope.claimIds = claimIds;
    $scope.reasons = [];
    $scope.otherReason = [];
    //console.log(item);

    $scope.ok = function () {
        if (approve) {
            var req = {};
            req.objects = [];
            $scope.items.forEach(function (item, i) {
                var obj = {
                    claimId: $scope.claimIds[i],
                    data: {
                        id: item._id,
                        reason: ''
                    }
                }
                req.objects.push(obj);
            });
            console.log(req);
            $http.patch('/api/candidates/expenses/approve', req).success(function (res) {
                //console.log(res);
            });
        } else {
            var req = {};
            req.objects = [];
            $scope.items.forEach(function (item, i) {
                var obj = {
                    claimId: $scope.claimIds[i],
                    data: {
                        id: item._id,
                        reason: $scope.reasons[i] != 'Other' ? $scope.reasons[i] : $scope.otherReason[i]
                    }
                }
                req.objects.push(obj);
            });
            console.log(req);
            $http.patch('/api/candidates/expenses/reject', req).success(function (res) {
                //console.log(res);
            });
        }
        // $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});