'use strict';

angular.module('origApp.controllers')
  .controller('usersController', ['$timeout','$scope', 'HttpResource', function($timeout,$scope, HttpResource) {
    
    $scope.options = {};


    var usersAPI = HttpResource.model('users');

    $scope.loadAllUsers = function() {
      var params = {};
 //     console.log('$scope.gridOptions.limit ==> ' + $scope.gridOptions.limit);
      if ($scope.options.limit) {
        params._limit = $scope.options.limit;
      }
      if ($scope.options.currentPage) {
        params._offset = ($scope.options.currentPage - 1) * $scope.options.limit;
      } else {
        params._offset = 0;
      }
      
      if ($scope.options.filterName) {
        params.firstName_contains = $scope.options.filterName;
      }

      if ($scope.options.filterEmail) {
        params.emailAddress_contains = $scope.options.filterEmail;
      }
      console.log(params)
      $scope.allData = usersAPI.query(params, function(data) {
        console.log($scope.allData);
        console.log(data);
        if (data.data.meta) {
          $scope.options.totalItems = data.data.meta.totalCount;
        }
      });
    };
    $scope.loadAllUsers();

    $scope.update = function(){
      console.log('work!');
    };

    var searchTimerPromise = null;
    $scope.filter = function () {
        $timeout.cancel(searchTimerPromise);
        searchTimerPromise = $timeout(function () {
            $scope.loadAllUsers();
        }, 500);
    };

    $scope.sendPasswardReset = function(index){
      var params = {};
      params.firstName = $scope.allData[index].firstName;
      params.lastName = $scope.allData[index].lastName;
      params.emailAddress = $scope.allData[index].emailAddress;
      console.log(params)
      HttpResource.model('users/send/passwardReset/'+$scope.allData[index]._id).query(params, function(data) {
          console.log(data)
      });
    }

}]);