'use strict';

var app = angular.module('origApp.controllers');

app.controller('ExpensesRateController', ['$scope', '$rootScope', 'expensesRateService', 'ModalService',
    function ($scope, $rootScope, expensesRateService, ModalService) {

        $rootScope.breadcrumbs = [{
            link: '/',
            text: 'Home'
        }, {
            link: '/admin/home',
            text: 'Admin'
        }, {
            link: '/admin/expensesrate',
            text: 'Expenses rate'
        }];

        $scope.expensesRate = {};

        /**
         * GETs list of expensesRate
         */
        function getExpensesRate() {
            expensesRateService.getExpensesRate().then(function (data) {
                if (data.objects) {
                    $scope.expensesRate = data.objects;
                }
            });
        }

        getExpensesRate();

        $scope.openModal = function (type, $index) {

            var mapExpensesRate = {};

            console.log(type);

            $scope.title = 'adding';

            if ($index !==undefined || $index !== null ) {
                mapExpensesRate = JSON.parse(JSON.stringify($scope.expensesRate));
                $scope.title = 'editing';
            }

            var modalInstance = ModalService.open({
                templateUrl: 'views/admin/expenses_rate/partials/' + type + '.html',
                controller: 'expensesRateModalController',
                size: 'md',
                scope: $scope,
                parentScope: mapExpensesRate[$index]
            });

            modalInstance.result.then(function (data) {
                // save data
                console.log('save ' + data);
                if ('saved' === data) {
                    getExpensesRate();
                }
            }, function (reason) {
                console.log(reason);
            });
        };

    }]);