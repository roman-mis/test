'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp8Controller', function($scope, HttpResource, ConstantsResource, MsgService, ValidationHelper) {
          $scope.expenseData.others = $scope.expenseData.others || [];
          $scope.types = ConstantsResource.get('otherexpensetypes');

          $scope.defaultAddData = {};
          $scope.addData = angular.copy($scope.defaultAddData);
          
          $scope.add = function() {
            $scope.expenseData.others.push($scope.addData);
            $scope.addData = angular.copy($scope.defaultAddData);
          };

          $scope.remove = function(index) {
            $scope.expenseData.others.splice(index, 1);
          };

          $scope.ok = function() {
            if ($scope.isAllDatesEntered($scope.expenseData.others)) {
              $scope.gotoNext();
            }
          };

          $scope.$watch('expenseData.others.length', function(){
            setTimeout(function(){
              $scope.normalizeTables();
            });
          });

          
          $(window).on('resize', $scope.normalizeTables);
        });
