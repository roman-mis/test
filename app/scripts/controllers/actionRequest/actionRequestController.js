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


        $scope.callModal = function (id, template) {

            HttpResource.model('actionrequests/' + id + '').customGet('', {}, function (data) {
                var controller;
                var parentScope = {};
                parentScope.candidate = {};
                parentScope.candidateId = data.data.object.worker.id;
                parentScope.candidate = data.data.object.worker;
                console.log(data);
                switch (template) {
                case 'ssp':
                    parentScope.showMe = true;
                    $scope.ssp = data.data.object;
                    controller = 'sspModalController';
                    $scope.temp={};
                    $scope.temp.logoFileName = data.data.object.imageUrl;
                    break;
                case 'smp':
                    controller = 'smpController';
                    $scope.smpObject = {};
                    $scope.smpObject = data.data.object;
                    $scope.temp={};
                    $scope.temp.logoFileName = data.data.object.imageUrl;
                    break;
                case 'studentloan':
                    controller='slController',
                    $scope.studentLoan=data.data.object.studentLoan;
                    $scope.id=data.data.object.id;
                    break;
                case 'spp':
                    controller='sppController';
                    template='sppModal';
                    $scope.sppObject={};
                    $scope.sppObject=data.data.object;
                    $scope.temp={};
                    $scope.temp.logoFileName = data.data.object.imageUrl;
                    break;
                case 'holidaypay':
                    controller='holidayPaymentController',
                    template='holidayPayment';
                    $scope.showMe=true;
                    $scope.hpObject={};
                    $scope.hpObject=data.data.object;


                }
                var modalInstance = ModalService.open({
                    templateUrl: 'views/actionRequest/' + template + '.html',
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
