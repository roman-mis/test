'use strict';
var app = angular.module('origApp.controllers');

app.controller('addNewCandidateModalCtrl', ['$scope', '$modalInstance', 'HttpResource',
    function ($scope, $modalInstance, HttpResource) {
    

    $scope.ok = function () {
        var data = {
            firstName: $scope.can.firstName,
            lastName: $scope.can.lastName,
            emailAddress: $scope.can.email,
            title: $scope.can.title,
            mobile: $scope.can.mobile,
            phone: $scope.can.phone,
            address1: $scope.can.address
        }

        HttpResource.model('candidates/')
	      	.create(data).post().then(function (result) {
	      	    console.log('*****');
	      	    console.log(result);
	      	});

        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);