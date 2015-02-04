'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp6Controller', function($scope, HttpResource, ConstantsResource, MsgService, ValidationHelper) {
          $scope.expenseData.subsistense = [];
          $scope.mealTypes = ConstantsResource.get('mealslist');

          $scope.defaultAddData = {};
          $scope.addData = angular.copy($scope.defaultAddData);

          $scope.add = function() {
            $scope.expenseData.subsistense.push($scope.addData);
            $scope.addData = angular.copy($scope.defaultAddData);
          };

          $scope.remove = function(index) {
            $scope.expenseData.subsistense.splice(index, 1);
          };

          $scope.ok = function() {
            if ($scope.isAllDatesEntered($scope.expenseData.subsistense)) {
              $scope.gotoNext();
            }
          };

          $scope.$watch('expenseData.subsistense.length', function(){
            setTimeout(function(){
              $scope.normalizeTables();
            });
          });

          
          $(window).on('resize', $scope.normalizeTables);
        });

