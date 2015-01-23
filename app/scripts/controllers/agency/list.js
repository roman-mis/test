'use strict';
angular.module('origApp.controllers')
        .controller('AgencyListController', function($scope, $rootScope, HttpResource, $location, $timeout) {
          $scope.$scope = $scope;
          $rootScope.breadcrumbs = [
            {link: '/', text: 'Home'},
            {text: 'Agencies'}
          ];

          $scope.ableLoadMore = false;
          $scope.search_name = '';

          //trigger filtering after 500ms from the last typing
          var searchTimerPromise = null;
          $scope.onDelaySearch = function() {
            $timeout.cancel(searchTimerPromise);
            searchTimerPromise = $timeout(function() {
              $scope.loadAgencies();
            }, 500);
          };


          //define grid structure
          $scope.gridOptions = {
            limit: 20,
            totalItems: 0,
            isPagination: false,
            onLimitChanged: function() {
              $scope.loadAgencies();
            },
            onPageChanged: function() {
              $scope.loadAgencies();
            },
            columns: [
              {field: 'name', display: 'Agency', cellTemplate: '<span ng-show="row.branches.length>0">' +
                        '<a href="javascript:void(0)" class="action_wrapper" data-agency-id="{{row._id}}" ng-click="getExternalScope().openBranch(row)">' +
                        '<i class="fa fa-plus-square"></i></a>&nbsp;&nbsp;</span>' +
                        '<a ng-href="/agencies/{{row._id}}">{{row.name}}</a>'},
              {field: 'country', display: 'Country'},
              {field: 'postcode', display: 'Postcode'},
              {field: 'town', display: 'Town'},
              {field: 'address', display: 'Address', cellTemplate: '{{row.address1}}<br/>{{row.address2}}'}
            ],
            data: []
          };

          // HTTP resource
          var acAPI = HttpResource.model('agencies');

          $scope.loadAgencies = function(isClear) {
            if (isClear || typeof (isClear) === 'undefined') {
              $scope.gridOptions.data = [];
            }
            var params = {};
            if ($scope.gridOptions.limit) {
              params._limit = $scope.gridOptions.limit;
            }
            if ($scope.search_name) {
              params.name_contains = $scope.search_name;
            }

            params._offset = $scope.gridOptions.data.length;
            
            $scope.isLoading = true;
            var items = acAPI.query(params, function() {
              $scope.isLoading = false;
              $scope.gridOptions.data = $scope.gridOptions.data.concat(items);
              if (items.meta) {
                $scope.gridOptions.totalItems = items.meta.total_count;
                if ($scope.gridOptions.data.length < $scope.gridOptions.totalItems) {
                  $scope.ableLoadMore = true;
                } else {
                  $scope.ableLoadMore = false;
                }
              }
            });
          };

          $scope.viewAgencyDetails = function(agency) {
            $location.path('/agencies/' + agency._id);
          };

          $scope.openBranch = function(agency) {
            $('#agency_list .branch-row[data-agency-id=' + agency._id + ']').remove();
            var clicker = $('#agency_list .action_wrapper[data-agency-id=' + agency._id + ']');
            if (clicker.find('.fa-plus-square').length > 0) {
              clicker.find('.fa-plus-square').removeClass('fa-plus-square').addClass('fa-minus-square');
            } else {
              clicker.find('.fa-minus-square').removeClass('fa-minus-square').addClass('fa-plus-square');
              return;
            }
            var agencyRow = clicker.closest('tr');
            var htmlStr = '';
            agency.branches.forEach(function(branch) {
              htmlStr += '<tr class="branch-row" data-agency-id="' + agency._id + '">' +
                      '<td>&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa fa-file-o"></i> &nbsp;' + (branch.name || '') + '</td>' +
                      '<td>' + (branch.branch_type || '') + '</td>' +
                      '<td>' + (branch.postcode || '') + '</td>' +
                      '<td>' + (branch.town || '') + '</td>' +
                      '<td>' + (branch.address1 || '') + '<br/>' + (branch.address2 || '') + '</td>' +
                      '</tr>';
            });
            agencyRow.after(htmlStr);
          };

          $scope.loadAgencies();

          $(document).on('click', '#agency_list td .action_wrapper', function(e) {
            e.preventDefault();
          });
          
          $rootScope.$on('newAgencyAdded', function(e, info){
            if(!$scope.ableLoadMore){
              $scope.gridOptions.data.push(info.agency);
            }
          });
        });
