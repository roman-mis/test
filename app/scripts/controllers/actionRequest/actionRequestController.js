'use strict';
angular.module('origApp.controllers')


    .controller('actionRequestController', function ($scope, HttpResource, ModalService) {


        $scope.status = {
            isopen: false
        };

        listActionRequest();

        function listActionRequest() {
            HttpResource.model('actionrequests').customGet('', {}, function (data) {
                $scope.lists = data.data.objects;
            }, function (err) {});

        }

        $scope.callModal = function (id, type, createdBy) {

            HttpResource.model('actionrequests/' + id + '').customGet('', {}, function (data) {
                var controller;
                var parentScope = {};
                parentScope.candidate = {};
                // parentScope.candidate.firstName = createdBy.name;
                // parentScope.candidate.id=createdBy.id;
                console.log(parentScope);
                parentScope.candidateId = data.data.object.worker.id;
                parentScope.candidate = data.data.object.worker;
                console.log(parentScope);
                switch (type) {
                case 'ssp':
                    parentScope.showMe = true;
                    $scope.ssp = data.data.object;
                    controller = 'sspModalController';
                    break;
                case 'smp':
                    controller = 'smpController';
                    $scope.smpObject = {};
                    $scope.smpObject.startDate = data.data.object.startDate;
                    $scope.smpObject.smp = data.data.object.smp;
                    $scope.smpObject.id = data.data.object.id;
                    $scope.smpObject.intendedStartDate = data.data.object.intendedStartDate;
                    $scope.smpObject.days = data.data.object.days;
                    $scope.smpObject.imageUrl = data.data.object.imageUrl;
                    break;
                }
                var modalInstance = ModalService.open({
                    templateUrl: 'views/actionRequest/' + type + '.html',
                    parentScope: parentScope,
                    scope: $scope,
                    controller: controller,
                    size: 'md'
                });

                modalInstance.result.then(function (data) {
                    listActionRequest();
                }, function (reason) {
                    console.log(reason);
                });
            });
        };
    });
