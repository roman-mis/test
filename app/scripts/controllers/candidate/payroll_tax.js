'use strict';
angular.module('origApp.controllers')
.controller('CandidatePayrollTaxController', function($scope, $stateParams, HttpResource, ModalService) {
  $scope.candidateId = $stateParams.candidateId;
  $scope.candidate = $scope.$parent.candidate;

  $scope.openTaxSetting = function () {
    ModalService.open({
      templateUrl: 'views/candidate/_payroll_tax_settings.html',
      parentScope: $scope,
      controller: 'CandidatePayrollTaxModalController'
    });
  };

  $scope.openPayslipSetting = function () {
    ModalService.open({
      templateUrl: 'views/candidate/_payslips.html',
      parentScope: $scope,
      controller: 'CandidatePayslipModalController'
    });
  };        
})

.controller('CandidatePayrollTaxModalController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, MsgService) {
  $scope.candidateId = angular.copy(parentScope.candidateId);

    //define private variables
    var candidateResource = HttpResource.model('candidates/' + $scope.candidateId);
    $scope.employeesNIpaidOptions = [
    {value:'Yes',code: true},
    {value: 'No',code: false}
    ];

    // Load Constants
    $scope.starterDeclarations = ConstantsResource.get('starterdeclarations');
    $scope.payFrequencies = ConstantsResource.get('payfrequencies');
    $scope.taxBasises = ConstantsResource.get('taxbasis');

    //load tax information
    $scope.loadTax = function() {
      $scope.tax = candidateResource.get('payrolltax');
    };

    $scope.loadTax();

    //save tax information
    $scope.saveTax = function() {
      $scope.isTaxSaving = true;
      candidateResource.create($scope.tax).patch('payrolltax')
      .then(function(response) {
        $scope.isTaxSaving = false;
        if (!HttpResource.flushError(response)) {
            //success callback
            MsgService.success('Tax Settings Successfully Saved.');
            $modalInstance.dismiss('cancel');
          }
        });
    };

    // Close Modal
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  })

.controller('CandidatePayslipModalController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, MsgService) {

});
