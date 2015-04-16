'use strict';
var app = angular.module('origApp.controllers');

app.controller('viewReceiptCtrl', function ($scope, $modalInstance, $http, rootScope, expense, claim, s3Service, $q, HttpResource) {

    $scope.claim = claim;
    $scope.expense = expense;
    $scope.receiptUrls = expense.receiptUrls;
    $scope.actualUrls = [];
    $scope.receiptUrls.forEach(function (justName) {
        $http.get('/api/documents/receipts/viewsignedurl/' + justName).success(function (res) {
            $scope.actualUrls.push({
                name: justName,
                img: res.url
            });
        });
    });

    $scope.deleteReceipt = function (receipt) {
        var index = $scope.actualUrls.indexOf(receipt);
        $scope.actualUrls.splice(index, 1);
        $scope.receiptUrls.splice(index, 1);
    }

    $scope.ok = function () {
        $modalInstance.close();
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancelled');
    };

    function logs(record, label) {
        //if (label) console.log(label + ':', record);
        //else console.log(record);
    }
});