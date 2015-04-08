'use strict';
var app = angular.module('origApp.controllers');

app.controller('rejectSummaryCtrl', function ($scope, $modalInstance, $http, item, claimInfo, rootScope) {
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
                    date: item.date,
                    type: item.expenseType,
                    subType: item.expenseDetail.name,
                    total: item.expenseDetail.total,
                    reason: '',
                    other: '',
                    cancel: function () {
                        cancel(obj.claimId, item._id);
                    }
                }
                if (rootScope.summary) {
                    for (var j = 0; j < rootScope.summary.length; j++) {
                        if (rootScope.summary[j].claimId == obj.claimId) {
                            for (var k = 0; k < rootScope.summary[j].expenses.length; k++) {
                                if (rootScope.summary[j].expenses[k].id == data.id) {
                                    data.reason = rootScope.summary[j].expenses[k].reason;
                                    data.other = rootScope.summary[j].expenses[k].other;
                                    break
                                }
                            }
                            break
                        }
                    }
                }
                obj.expenses.push(data);
            }
        });
        $scope.objects.push(obj);
    });

    function cancel(claimId, expenseId) {
        for (var i = 0; i < $scope.objects.length; i++) {
            if ($scope.objects[i].claimId == claimId) {
                for (var j = 0; j < $scope.objects[i].expenses.length; j++) {
                    if ($scope.objects[i].expenses[j].id == expenseId) {
                        $scope.objects[i].expenses.splice(j, 1);
                        break
                    }
                }
                break
            }
        }
        rootScope.cancel(claimId, expenseId);
    }

    $scope.ok = function () {
        var req = {};
        req.objects = $scope.objects;
        console.log(req);
        $http.patch('/api/candidates/expenses/reject', req).success(function (res) {
            //console.log(res);
        });
        $modalInstance.close();
    };

    $scope.save = function () {
        rootScope.summary = $scope.objects;
        $modalInstance.dismiss('saved');
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancelled');
    };
});