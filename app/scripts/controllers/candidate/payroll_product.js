'use strict';
angular.module('origApp.controllers')
        .controller('CandidatePayrollProductController', function($scope, $stateParams, HttpResource, ConstantsResource) {

          //define private variables
          var productResource = HttpResource.model('candidates/' + $scope.candidateId + '/payrollproduct');
          var agencyResource = HttpResource.model('agencies');

          //define public variables
          $scope.candidateId = $stateParams.candidateId;
          $scope.$scope = $scope;
          $scope.product = {};
          //define grid structure
          $scope.gridOptions = {
            isPagination: false,
            columns: [
              {field: 'serviceUsed', display: 'Product', cellTemplate: '{{getExternalScope().getConstantDescription("servicesused", row.serviceUsed)}}'},
              {field: 'agencyId', display: 'Agency', cellTemplate: '{{getExternalScope().getConstantDescription("agencies", row.agencyId)}}'},
              {field: 'margin', display: 'Margin', cellTemplate: '{{getExternalScope().getConstantDescription("margins", row.margin)}}'},
              {field: 'holidayPayRule', display: 'Hol. Pay', cellTemplate: '{{getExternalScope().getConstantDescription("holidaypayrules", row.holidayPayRule)}}'},
              {field: 'derogationContract', display: 'Decoration', cellTemplate: '{{getExternalScope().getConstantDescription("derogationcontracts", row.derogationContract)}}'},
              {field: 'action', display: '', cellTemplate: '<a href="javacript:void(0)" ng-click="getExternalScope().deleteProduct(row)"><i class="fa fa-trash-o"></i></a> ' + 
                        '<a href="javacript:void(0)" ng-click="getExternalScope().editProduct(row)"><i class="fa fa-edit"></i></a>', textAlign: 'center'}
            ],
            data: []
          };
          $scope.agencies = agencyResource.query({}, function() {
            $scope.agenciesHash = ConstantsResource.makeHashData('_id', $scope.agencies);
          });

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

          //load products
          $scope.loadProducts = function() {
            var params = {};
            $scope.gridOptions.data = productResource.query(params, function() {
              //success callback
              //console.log($scope.gridOptions.data);
            });
          };

          //save product information
          $scope.saveProduct = function() {
            var successCallback = function(response) {
              $scope.isSaving = false;
              if (!HttpResource.flushError(response)) {
                //$scope.loadProducts();
                if ($scope.product._id) { //if edited
                  jQuery($scope.gridOptions.data).each(function(index) {
                    if (this._id === $scope.product._id) {
                      angular.copy($scope.product, $scope.gridOptions.data[index]);
                    }
                  });
                } else { //if added
                  $scope.gridOptions.data.push($scope.product);
                }
                $scope.product = {};
              }
            };
            $scope.isSaving = true;
            if ($scope.product._id) {
              $scope.product.patch()
                      .then(successCallback);
            } else {
              $scope.product = productResource.create($scope.product);
              $scope.product.post()
                      .then(successCallback);
            }
          };

          //delete product
          $scope.deleteProduct = function(product) {
            product.delete().then(function(response) {
              if (!HttpResource.flushError(response)) {
                //remove row from the grid
                jQuery($scope.gridOptions.data).each(function(index) {
                  if (this._id === product._id) {
                    $scope.gridOptions.data.splice(index, 1);
                  }
                });
              }
            });
          };

          //edit product
          $scope.editProduct = function(product) {
            angular.copy(product, $scope.product);
          };


          $scope.loadProducts();

        });
