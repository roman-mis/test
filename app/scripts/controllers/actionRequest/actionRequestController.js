'use strict';
angular.module('origApp.controllers')


    .controller('actionRequestController', function ($scope, HttpResource, ModalService) {


        $scope.status = {
            isopen: false
        };

        function listActionRequest() {
            HttpResource.model('actionrequests').customGet('', {}, function (data) {
                $scope.lists = data.data.objects;
            }, function (err) {
                console.log(err);
            });

        }

        listActionRequest();


        $scope.callModal = function (id, type, createdBy) {
            console.log(createdBy);
            HttpResource.model('actionrequests/' + id + '').customGet('', {}, function (data) {
                var controller;
                
                var parentScope = {};
                parentScope.candidate = {};

                parentScope.candidateId = data.data.object.worker.id;
                parentScope.candidate = data.data.object.worker;
                
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
                        $scope.smpObject.dateInformed = data.data.object.dateInformed;
                        $scope.smpObject.actualStartDate = data.data.object.actualStartDate;
                        $scope.smpObject.intendedStartDate = data.data.object.intendedStartDate;
                        $scope.smpObject.days = data.data.object.days;
                        $scope.smpObject.imageUrl = data.data.object.imageUrl;
                        break;
                    case 'studentloan':
                        controller='slController';
                        $scope.studentLoan=data.data.object.studentLoan;
                        $scope.id=data.data.object.id;
                        break;
                    case 'spp':
                        controller='sppController';
                        type='sppModal';
                        $scope.id=data.data.object.id;
                        $scope.sppObject={};
                        console.log(data.data.object.spp);
                        $scope.sppObject.spp=data.data.object.spp;
                        $scope.sppObject.days=data.data.object.days;
                        $scope.sppObject.imageUrl=data.data.object.imageUrl;
                        $scope.temp={};
                        $scope.temp.logoFileName = data.data.object.imageUrl;
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
                    console.log(data);
                    listActionRequest();
                }, function (reason) {
                    console.log(reason);
                });
            });
        };
    });
