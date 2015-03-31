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
    $scope.uniqueClaimIds = [];
    $scope.claimIds.forEach(function (id) {
        if ($scope.uniqueClaimIds.indexOf(id) == -1) {
            $scope.uniqueClaimIds.push(id);
        }
    });

    $scope.ok = function () {
        if (approve) {
            var req = {};
            req.objects = [];
            $scope.uniqueClaimIds.forEach(function (uniId) {
                var obj = {
                    claimId: uniId,
                    expenses: []
                };
                $scope.items.forEach(function (item, i) {
                    if ($scope.claimIds[i] == uniId) {
                        var data = {
                            id: item._id,
                            reason: ''
                        }
                    }
                    obj.expenses.push(data);
                });
                req.objects.push(obj);
            });
            console.log(req);
            $http.patch('/api/candidates/expenses/approve', req).success(function (res) {
                //console.log(res);
            });
        } else {
            var req = {};
            req.objects = [];
            $scope.uniqueClaimIds.forEach(function (uniId) {
                var obj = {
                    claimId: uniId,
                    expenses: []
                };
                $scope.items.forEach(function (item, i) {
                    if ($scope.claimIds[i] == uniId) {
                        var data = {
                            id: item._id,
                            reason: $scope.reasons[i] != 'Other' ? $scope.reasons[i] : $scope.otherReason[i]
                        }
                    }
                    obj.expenses.push(data);
                });
                req.objects.push(obj);
            });
            console.log(req);
            $http.patch('/api/candidates/expenses/reject', req).success(function (res) {
                //console.log(res);
            });
        }
         $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});