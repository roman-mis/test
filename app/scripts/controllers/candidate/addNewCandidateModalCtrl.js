'use strict';
var app = angular.module('origApp.controllers');

app.controller('addNewCandidateModalCtrl', ['$scope', '$modalInstance', 'HttpResource', '$http',
    function ($scope, $modalInstance, HttpResource, $http) {
        $http.get('/api/constants/candidateTitle/').success(function (data) {
            var titles = data;
            $scope.titleary = [];
            titles.forEach(function (item) {
                $scope.titleary.push(item.value);
            });
        });
        $scope.can = {};

        $scope.ok = function () {
            var data = {
                title: $scope.can.title,
                firstName: $scope.can.firstName,
                lastName: $scope.can.lastName,
                emailAddress: $scope.can.email,
                phone: $scope.can.contactNumber,
                niNumber: $scope.can.niNumber,
                birthDate: $scope.can.birthDate
            }

            HttpResource.model('candidates/admin')
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