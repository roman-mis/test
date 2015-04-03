﻿'use strict';
var app = angular.module('origApp.controllers');

app.controller('rejectSummaryCtrl', function ($scope, $modalInstance, $http, item, claimInfo) {
    $scope.items = item;
    $scope.claimInfo = claimInfo;
    $scope.reasons = [];
    $scope.otherReason = [];
    $scope.uniqueClaims = [];
    $scope.claimInfo.forEach(function (info) {
        var found = false;
        for (var i = 0; i < $scope.uniqueClaims.length; i++) {
            if ($scope.uniqueClaims[i].claimId == info.claimId) {
                found = true;
                break
            }
        }
        if (!found) $scope.uniqueClaims.push(info);
    });

    $scope.objects = [];
    $scope.uniqueClaims.forEach(function (uni) {
        var obj = {
            claimId: uni.claimId,
            claimRef: uni.claimRef,
            userName: uni.userName,
            expenses: [],
            categories: []
        };
        $scope.items.forEach(function (item, i) {
            if ($scope.claimInfo[i].claimId == uni.claimId) {
                if (obj.categories.indexOf(item.expenseType) == -1) {
                    obj.categories.push(item.expenseType);
                }
                var data = {
                    id: item._id,
                    type: item.expenseType,
                    subType: item.expenseDetail.name,
                    total: item.expenseDetail.total,
                    reason: '',
                    other: ''
                }
                obj.expenses.push(data);
            }
        });
        $scope.objects.push(obj);
    });

    $scope.ok = function () {
        var req = {};
        req.objects = $scope.objects;
        console.log(req);
        $http.patch('/api/candidates/expenses/reject', req).success(function (res) {
            //console.log(res);
        });
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});