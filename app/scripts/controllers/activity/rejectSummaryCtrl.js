'use strict';
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

    $scope.ok = function () {
        //if (approve) {
        //    var req = {};
        //    req.objects = [];
        //    $scope.uniqueClaimIds.forEach(function (uniId) {
        //        var obj = {
        //            claimId: uniId,
        //            expenses: []
        //        };
        //        $scope.items.forEach(function (item, i) {
        //            if ($scope.claimInfo[i].claimId == uniId) {
        //                var data = {
        //                    id: item._id,
        //                    reason: ''
        //                }
        //                obj.expenses.push(data);
        //            }
        //        });
        //        req.objects.push(obj);
        //    });
        //    console.log(req);
        //    $http.patch('/api/candidates/expenses/approve', req).success(function (res) {
        //        //console.log(res);
        //    });
        //} else {
        var req = {};
        req.objects = [];
        $scope.uniqueClaims.forEach(function (uni) {
            var obj = {
                claimId: uni.claimId,
                expenses: []
            };
            $scope.items.forEach(function (item, i) {
                if ($scope.claimInfo[i].claimId == uni.claimId) {
                    var data = {
                        id: item._id,
                        reason: $scope.reasons[i] != 'Other' ? $scope.reasons[i] : $scope.otherReason[i]
                    }
                    obj.expenses.push(data);
                }
            });
            req.objects.push(obj);
        });
        console.log(req);
        //$http.patch('/api/candidates/expenses/reject', req).success(function (res) {
        //    //console.log(res);
        //});
        //}
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});