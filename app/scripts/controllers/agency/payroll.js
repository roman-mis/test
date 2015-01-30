'use strict';
angular.module('origApp.controllers')
        .controller('AgencyPayrollController', function($scope, ModalService, $stateParams, HttpResource, ConstantsResource) {
          $scope.agencyId = $stateParams.agencyId;
  
          function loadPayrollData() {
            $scope.payrollData = HttpResource.model('agencies/' + $scope.agencyId).get('payroll', function(){
              $scope.loadNames();
            });
          }
          
          $scope.loadNames = function(){
            //load invoice design detail
            if($scope.payrollData.defaultInvoicing.invoiceDesign){
              $scope.payrollData.defaultInvoicing.invoiceDesign = HttpResource.model('invoicedesigns').get($scope.payrollData.defaultInvoicing.invoiceDesign, function(){
                console.log($scope.payrollData.defaultInvoicing.invoiceDesign);
              });
            }

            //get invoiceTo label
            $scope.agency = HttpResource.model('agencies').get($scope.agencyId, function(){
              var invoiceToItems = $scope.agency.branches.filter(function(branch){
                return branch._id == $scope.payrollData.defaultInvoicing.invoiceTo;
              });
              if(invoiceToItems.length > 0){
                $scope.payrollData.defaultInvoicing.invoiceTo = invoiceToItems[0];
              }else{
                $scope.payrollData.defaultInvoicing.invoiceTo = null;
              }
            });
          };


          $scope.getConstant = function(constantKey, code) {
            var hashData = ConstantsResource.getHashData(constantKey);
            if (!hashData || !hashData[code]) {
              return {};
            }
            return hashData[code];
          };

          $scope.openAgencyDefaultInvoicing = function() {
            ModalService.open({
              templateUrl: 'views/agency/_edit_default_invoicing.html',
              parentScope: $scope,
              controller: '_EditAgencyDefaultInvoicing',
              size: 'lg'
            });
          };

          $scope.openAgencyDefaultPayroll = function() {
            ModalService.open({
              templateUrl: 'views/agency/_edit_default_payroll.html',
              parentScope: $scope,
              controller: '_EditAgencyDefaultPayroll'
            });
          };
          
          loadPayrollData();

        })

        //Edit Agency Default Invoicing
        .controller('_EditAgencyDefaultInvoicing', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource) {
          $scope.data = {};
          angular.copy(parentScope.payrollData.defaultInvoicing, $scope.data);
          for(var key in $scope.data){
            if($scope.data[key].code){
              $scope.data[key] = $scope.data[key].code;
            }
            if($scope.data[key]._id){
              $scope.data[key] = $scope.data[key]._id;
            }
          }
          
          $scope.invoiceMethods = ConstantsResource.get('invoicemethods');
          $scope.paymentTerms = ConstantsResource.get('paymentterms');
          $scope.invoiceDesigns = HttpResource.model('invoicedesigns').query({});
          
          $scope.agency = HttpResource.model('agencies').get(parentScope.agencyId);
          
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.ok = function() {
            $scope.isSaving = true;
            HttpResource.model('agencies/' + parentScope.agencyId).create($scope.data)
                    .patch('payroll')
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        parentScope.payrollData = jQuery.extend(parentScope.payrollData, response.data.object);
                        parentScope.loadNames();
                        $modalInstance.close();
                      }
                    });
          };
        })

        //Edit Agency Default Payroll
        .controller('_EditAgencyDefaultPayroll', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource) {
          $scope.data = {};
          angular.copy(parentScope.payrollData.defaultPayroll, $scope.data);
          for(var key in $scope.data){
            if($scope.data[key].code){
              $scope.data[key] = $scope.data[key].code;
            }
            if($scope.data[key]._id){
              $scope.data[key] = $scope.data[key]._id;
            }
          }
  
          $scope.serviceUsed = ConstantsResource.get('servicesused');
          $scope.marginTypes = ConstantsResource.get('margintypes');
          
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.ok = function() {
            $scope.isSaving = true;
            HttpResource.model('agencies/' + parentScope.agencyId).create($scope.data)
                    .patch('payroll')
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        parentScope.payrollData = jQuery.extend(parentScope.payrollData, response.data.object);
                        $modalInstance.close();
                      }
                    });
          };
        });