'use strict';
angular.module('origApp.controllers')
.controller('CandidatePayrollProductController', function($scope, $stateParams, HttpResource, ConstantsResource, ModalService, MsgService) {

          //define private variables
          var productResource = HttpResource.model('candidates/' + $scope.candidateId + '/payrollproduct');
          var agencyResource = HttpResource.model('agencies');

          $scope.agencies = agencyResource.query({}, function() {
            $scope.agenciesHash = ConstantsResource.makeHashData('_id', $scope.agencies);
          });

          $scope.margins = ConstantsResource.get('margins');
          $scope.holidayPayRules = ConstantsResource.get('holidaypayrules');
          $scope.derogationContracts = ConstantsResource.get('derogationcontracts');
          $scope.serviceUsed = ConstantsResource.get('servicesused');
          $scope.paymentTerms = ConstantsResource.get('paymentterms');
          $scope.paymentMethods = ConstantsResource.get('paymentmethods');

          //define public variables
          $scope.candidate = $scope.$parent.candidate;
          $scope.candidateId = $stateParams.candidateId;
          $scope.$scope = $scope;
          $scope.product = {};

          //define grid structure
          $scope.gridOptions = {
            isPagination: false,
            columns: [
            {field: 'serviceUsed', display: 'Product', cellTemplate: '{{getExternalScope().getConstantDescription("servicesused", row.serviceUsed)}}'},
            {field: 'agencyId', display: 'Agency', cellTemplate: '{{row.agency.name}}'},
            {field: 'margin', display: 'Margin', cellTemplate: '{{getExternalScope().getConstantDescription("margins", row.margin)}}'},
            {field: 'holidayPayRule', display: 'Hol. Pay', cellTemplate: '{{getExternalScope().getConstantDescription("holidaypayrules", row.holidayPayRule)}}'},
            {field: 'derogationContract', display: 'Decoration', cellTemplate: '{{getExternalScope().getConstantDescription("derogationcontracts", row.derogationContract)}}'},
            {field: 'action', display: '', cellTemplate: '<a href="javascript:void(0);" ng-click="getExternalScope().deleteProduct(row)"><i class="fa fa-trash-o"></i></a> ' +
            '<a href="javascript:void(0);" ng-click="getExternalScope().editProduct(row)"><i class="fa fa-edit"></i></a>', textAlign: 'center'}
            ],
            data: []
          };


          $scope.getConstantDescription = function(constantKey, code) {
            var hashData = constantKey === 'agencies' ? $scope.agenciesHash : ConstantsResource.getHashData(constantKey);
            if (code && hashData && hashData[code]) {
              if (constantKey === 'agencies') {
                return hashData[code].name || '';
              }
              return hashData[code].description || '';
            }
            return '';
          };

          $scope.openAddPayrollProductModal = function(){
            $scope.mode='add';
            ModalService.open({
              templateUrl: 'views/candidate/_payroll_product_add_service.html',
              parentScope: $scope,
              controller: 'CandidatePayrollProductModalController'
            });
          };

          //load products
          $scope.loadProducts = function() {
            var params = {};
            $scope.gridOptions.data = productResource.query(params, function() {});
          };



          //delete product
          $scope.deleteProduct = function(product) {
            product.delete().then(function(response) {
              if (!HttpResource.flushError(response)) {
                //remove row from the grid
                $scope.gridOptions.data.forEach(function(value, key) {
                  if (value._id === product._id) {
                    $scope.gridOptions.data.splice(key, 1);
                    MsgService.success('Payroll Product Successfully Deleted.');
                  }
                });
              }
            });
          };

          //edit product
          $scope.editProduct = function(product) {
            $scope.mode='edit';
            $scope.editId = product._id;

            ModalService.open({
              templateUrl: 'views/candidate/_payroll_product_add_service.html',
              parentScope: $scope,
              controller: 'CandidatePayrollProductModalController'
            });
          };

          $scope.cancelEdit = function(){
            $scope.product = {};
          };


          $scope.loadProducts();

        })

.controller('CandidatePayrollProductModalController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, MsgService) {
  var mode = angular.copy(parentScope.mode);

  $scope.candidateId = angular.copy(parentScope.candidateId);
  $scope.gridOptions = parentScope.gridOptions;

  if(mode.toString() === 'edit'){
    var editId = angular.copy(parentScope.editId);
    for(var i = 0; i < $scope.gridOptions.data.length; i++){
      if($scope.gridOptions.data[i]._id === editId){
        $scope.product = $scope.gridOptions.data[i];
        break;
      }
    }
  }else{
    $scope.product = {};
  }

  var productResource = HttpResource.model('candidates/' + $scope.candidateId + '/payrollproduct');
  $scope.agencies = angular.copy(parentScope.agencies);


  $scope.margins = angular.copy(parentScope.margins);
  $scope.holidayPayRules = angular.copy(parentScope.holidayPayRules);
  $scope.derogationContracts = angular.copy(parentScope.derogationContracts);
  $scope.serviceUsed = angular.copy(parentScope.serviceUsed);
  $scope.paymentTerms = angular.copy(parentScope.paymentTerms);
  $scope.paymentMethods = angular.copy(parentScope.paymentMethods);

    //save product information
    $scope.saveProduct = function() {
      var successCallback = function(response) {

        $scope.isSaving = false;

        if (!HttpResource.flushError(response)) {
          //$scope.loadProducts();
          MsgService.success('Payroll Product Successfully Added.');
          var newObject = productResource.create(response.data.object);
          if ($scope.product._id) { //if edited
            $scope.gridOptions.data.forEach(function(value, index) {
              if (value._id === $scope.product._id) {
                angular.copy(newObject, $scope.gridOptions.data[index]);
              }
            });
          } else { //if added
            $scope.gridOptions.data.push(newObject);
          }
          $scope.product = {};
          $modalInstance.dismiss('cancel');
        }
      };
      if ($scope.product._id) {
        $scope.isSaving = true;
        $scope.product.patch().then(successCallback);
      } else {
        var notExistedAgency = true;
        for(var i = 0; i < $scope.gridOptions.data.length; i++){
          if($scope.gridOptions.data[i].agency){
            if($scope.product.agency === $scope.gridOptions.data[i].agency._id){
              notExistedAgency = false;
              MsgService.danger('Agency already linked to this candidate');
              break;
            }
          }
        }
        if(notExistedAgency === true){
          $scope.isSaving = true;
          $scope.product = productResource.create($scope.product);
          $scope.product.post().then(successCallback);
        }
      }
    };

    $scope.agencySelected = function() {
      console.log('got here');
      for (var i = 0; i < $scope.agencies.length; i++) {
        if ($scope.agencies[i]._id === $scope.product.agency) {
          $scope.product.agencyRef = $scope.agencies[i].agencyNo;
          break;
        }
      }            
    }

    // Close Modal
    $scope.cancelEdit = function() {
      $scope.product = {};
      $modalInstance.dismiss('cancel');
    };
  });
