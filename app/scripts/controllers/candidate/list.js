'use strict';
angular.module('origApp.controllers')
        .controller('CandidateListController', function($scope, $rootScope, HttpResource, $location, $timeout) {
          $scope.$scope = $scope;
          $rootScope.breadcrumbs = [
            {link: '/', text: 'Home'},
            {text: 'Candidates'}
          ];

          //trigger filtering after 500ms from the last typing
          var searchTimerPromise = null;
          $scope.onDelaySearch = function() {
            $timeout.cancel(searchTimerPromise);
            searchTimerPromise = $timeout(function() {
              $scope.loadCandidates();
            }, 500);
          };

          //define grid structure
          $scope.gridOptions = {
            limit: 20,
            totalItems: 0,
            isPagination: true,
            onLimitChanged: function() {
              $scope.loadCandidates();
            },
            onPageChanged: function() {
              $scope.loadCandidates();
            },
            columns: [
              {field: 'name', display: 'Name', cellTemplate: '{{row.title}}. {{row.first_name}} {{row.last_name}}'},
              {field: 'contact_number', display: 'Contact number'},
              {field: 'address_1', display: 'Address'},
              {field: 'email_address', display: 'Email', cellTemplate: '<a href="mailto:{{row.email_address}}">{{row.email_address}}</a>'},
              {field: 'phone', display: 'Phone'},
              {field: 'view', display: 'View', cellTemplate: '<a href="javacript:void(0)" ng-click="getExternalScope().viewDetails(row)"><i class="fa fa-eye"></i></a>', textAlign: 'center'}
            ],
            data: []
          };

          // HTTP resource
          var cddAPI = HttpResource.model('candidates');

          $scope.loadCandidates = function() {
            var params = {};
            if ($scope.gridOptions.limit) {
              params._limit = $scope.gridOptions.limit;
            }
            if ($scope.gridOptions.currentPage) {
              params._offset = ($scope.gridOptions.currentPage - 1) * $scope.gridOptions.limit;
            } else {
              params._offset = 0;
            }
            if ($scope.filter_first_name) {
              params.first_name_contains = $scope.filter_first_name;
            }
            $scope.gridOptions.data = cddAPI.query(params, function() {
              if ($scope.gridOptions.data.meta) {
                $scope.gridOptions.totalItems = $scope.gridOptions.data.meta.total_count;
              }
            });
          };

          $scope.loadCandidates();

          $scope.viewDetails = function(candidate) {
            $location.path('/candidates/' + candidate._id);
          };
        });
