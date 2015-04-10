'use strict';
angular.module('origApp.controllers')


.controller('actionRequestController', function($scope, HttpResource, ModalService) {

        $scope.$scope = $scope;

        $scope.status = {
            isopen: false
        };

        //define grid structure
        $scope.gridOptions = {
            limit: 20,
            totalItems: 0,
            isPagination: true,
            onLimitChanged: function () {
                $scope.loadActionRequestList();
            },
            onPageChanged: function () {
                $scope.loadActionRequestList();
            },
            columns: [
                { field: 'contractorId', display: 'Contractor ID', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().callModal(row.id, row.type)">{{row.worker.candidateNo}}</div>' },
                { field: 'contractorName', display: 'Contractor Name', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().callModal(row.id, row.type)">{{row.worker.name | capitalizeAll}}</div>' },
                { field: 'dateRequested', display: 'Date Requested', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().callModal(row.id, row.type)"> {{row.dateRequested | date:"MM/dd/yyyy"}}</div>' },
                { field: 'type', display: 'Type', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().callModal(row.id, row.type)"> {{row.type | capitalizeAll}}</div>' },
                { field: 'periodActioned', display: 'Period Actioned', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().callModal(row.id, row.type)"> {{row.periodActioned}}</div>' },
                { field: 'userRequested', display: 'User Requested', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().callModal(row.id, row.type)">{{row.createdBy.name  | capitalizeAll}}</div>' },
                { field: 'requestRef.', display: 'Request Ref.', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().callModal(row.id, row.type)">{{row.requestRef}}</div>' },
                { field: 'status', display: 'Status', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().callModal(row.id, row.type)">{{row.status | capitalize}}</div>' },
                { field: '', display: '', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().callModal(row.id, row.type)"> <a href=""><i class="fa fa-folder-open-o"></i></a></div>' }
            ],
            data: []
        };

        // HTTP resource
        var cddAPI = HttpResource.model('actionrequests');


        $scope.loadActionRequestList = function () {
            var params = {};
            if ($scope.gridOptions.limit) {
                params._limit = $scope.gridOptions.limit;
            }
            if ($scope.gridOptions.currentPage) {
                params._offset = ($scope.gridOptions.currentPage - 1) * $scope.gridOptions.limit;
            } else {
                params._offset = 0;
            }

            $scope.gridOptions.data = cddAPI.query(params, function () {

                if ($scope.gridOptions.data.meta) {
                    $scope.gridOptions.totalItems = $scope.gridOptions.data.meta.totalCount;
                }
            });
        };

        $scope.loadActionRequestList();


        $scope.callModal = function (id, template) {

        HttpResource.model('actionrequests/' + id + '').customGet('', {}, function (data) {
            var controller;
            var parentScope = {};
            parentScope.candidate = {};
            parentScope.candidateId = data.data.object.worker.id;
            parentScope.candidate = data.data.object.worker;
            switch (template) {
                case 'ssp':
                    parentScope.showMe = true;
                    $scope.ssp = data.data.object;
                    controller = 'sspModalController';
                    $scope.temp = {};
                    $scope.temp.logoFileName = data.data.object.imageUrl;
                    break;
                case 'smp':
                    controller = 'smpController';
                    $scope.smpObject = {};
                    $scope.smpObject = data.data.object;
                    $scope.temp = {};
                    $scope.temp.logoFileName = data.data.object.imageUrl;
                    break;
                case 'studentloan':
                    controller = 'slController',
                    $scope.studentLoan = data.data.object.studentLoan;
                    $scope.id = data.data.object.id;
                    break;
                case 'spp':
                    controller = 'sppController';
                    template = 'sppModal';
                    $scope.sppObject = {};
                    $scope.sppObject = data.data.object;
                    $scope.temp = {};
                    $scope.temp.logoFileName = data.data.object.imageUrl;
                    parentScope.showMe = true;
                    break;
                case 'holidaypay':
                    controller = 'holidayPaymentController',
                    template = 'holidayPayment';
                    $scope.showMe = true;
                    $scope.hpObject = {};
                    $scope.hpObject = data.data.object;
                    $scope.id=data.data.object.id;

            }
            var modalInstance = ModalService.open({
                templateUrl: 'views/actionRequest/' + template + '.html',
                parentScope: parentScope,
                scope: $scope,
                controller: controller,
                size: 'md'
            });

            modalInstance.result.then(function(data) {
                $scope.loadActionRequestList();
            }, function(reason) {
//                console.log('reason');
//                console.log(reason);
//                $scope.loadActionRequestList();
            });
        });
    };
});
