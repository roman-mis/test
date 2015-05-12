'use strict';
angular.module('origApp.controllers')
        .controller('CandidatePayrollController', function($scope, $stateParams, HttpResource, ConstantsResource) {
          $scope.activeTab = 'product';
          $scope.candidateId = $stateParams.candidateId;

          //define private variables
          var candidateResource = HttpResource.model('candidates/' + $scope.candidateId);

          //load constants
          $scope.agencies = [];
          $scope.starterDeclarations = ConstantsResource.get('starterdeclarations');
          $scope.payFrequencies = ConstantsResource.get('payfrequencies');
          $scope.taxBasises = ConstantsResource.get('taxbasis');
          $scope.margins = ConstantsResource.get('margins');
          $scope.holidayPayRules = ConstantsResource.get('holidaypayrules');
          $scope.derogationContracts = ConstantsResource.get('derogationcontracts');
          $scope.serviceUsed = ConstantsResource.get('servicesused');
          $scope.paymentTerms = ConstantsResource.get('paymentterms');
          $scope.paymentMethods = ConstantsResource.get('paymentmethods');

          $scope.addSubBreadcrumb({'text': 'Payroll'});

          $scope.setTabActive = function(newValue) {
            console.log(newValue);

            this.activeTab = newValue;
          };

          $scope.isTabActive = function(tabID) {
            return this.activeTab === tabID;
          };

          //load tax information
          $scope.loadTax = function() {
            $scope.tax = candidateResource.get('payrolltax');
          };

          //save tax information
          $scope.saveTax = function() {
            $scope.isTaxSaving = true;
            candidateResource.create($scope.tax).patch('payrolltax')
                    .then(function(response) {
                      $scope.isTaxSaving = false;
                      if (!HttpResource.flushError(response)) {
                        //success callback
                      }
                    });
          };

          $scope.loadTax();

        });
