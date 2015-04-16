'use strict';
angular.module('origApp.controllers')
        .controller('CandidateListController', function ($scope, $modal, $rootScope, HttpResource, $location, $timeout) {
            $scope.$scope = $scope;
            $rootScope.breadcrumbs = [
              { link: '/', text: 'Home' },
              { text: 'Candidates' }
            ];

            //trigger filtering after 500ms from the last typing
            var searchTimerPromise = null;
            $scope.onDelaySearch = function () {
                $timeout.cancel(searchTimerPromise);
                searchTimerPromise = $timeout(function () {
                    $scope.loadCandidates();
                }, 500);
            };


            //define grid structure
            $scope.gridOptions = {
                limit: 20,
                totalItems: 0,
                isPagination: true,
                onLimitChanged: function () {
                    $scope.loadCandidates();
                },
                onPageChanged: function () {
                    $scope.loadCandidates();
                },
                columns: [
                  { field: 'name', display: 'Name', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().viewDetails(row)">&nbsp;&nbsp; {{row.title}}. {{row.firstName}} {{row.lastName}}</div>' },
                  { field: 'contactNumber', display: 'Contact number', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().viewDetails(row)">&nbsp;&nbsp; {{row.contactNumber}}</div>' },
                  { field: 'address1', display: 'Address', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().viewDetails(row)">&nbsp;&nbsp; {{row.address1}}</div>' },
                  { field: 'emailAddress', display: 'Email', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().viewDetails(row)"><a href="mailto:{{row.emailAddress}}">{{row.emailAddress}}</a></div>' },
                  { field: 'phone', display: 'Phone', cellTemplate: '<div style="width:100%;" ng-click="getExternalScope().viewDetails(row)">&nbsp;&nbsp; {{row.phone}}</div>' }
                ],
                data: []
            };

            // HTTP resource
            var cddAPI = HttpResource.model('candidates');


            $scope.loadCandidates = function () {
                var params = {};
                if ($scope.gridOptions.limit) {
                    params._limit = $scope.gridOptions.limit;
                }
                if ($scope.gridOptions.currentPage) {
                    params._offset = ($scope.gridOptions.currentPage - 1) * $scope.gridOptions.limit;
                } else {
                    params._offset = 0;
                }            
               if ($scope.searchText) {
                    params.searchText= $scope.searchText;
                } 
                $scope.gridOptions.data = cddAPI.query(params, function () {

                    if ($scope.gridOptions.data.meta) {
                        $scope.gridOptions.totalItems = $scope.gridOptions.data.meta.totalCount;
                    }
                });
            };

            $scope.loadCandidates();

            $scope.viewDetails = function (candidate) {
                $location.path('/candidates/' + candidate._id);
            };

            $scope.addNewCandidate = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'views/candidate/_addNewCandidate.html',
                    controller: 'addNewCandidateModalCtrl',
                    size: 'md'
                });

                modalInstance.result.then(function (editedItems) {
                    
                }, function () {
                    
                });
            }

        });
