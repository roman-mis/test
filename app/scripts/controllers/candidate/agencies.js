'use strict';
angular.module('origApp.controllers')
        .controller('CandidateAgenciesController', function($scope, HttpResource, ModalService, $stateParams, ConstantsResource) {
          var candidateId = $stateParams.candidateId;
  
          $scope.oneAtATime = true;
          $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
          };

          $scope.serviceUsed = ConstantsResource.get('servicesused');
          $scope.serviceMargins = ConstantsResource.get('margins');
          $scope.payrollProducts = HttpResource.model('candidates/' + candidateId + '/payrollproduct').query({});
          $scope.agencies = HttpResource.model('agencies').query({}, function() {
            $scope.agenciesHash = ConstantsResource.makeHashData('_id', $scope.agencies);
          });
          $scope.deductionTypes = ConstantsResource.get('deductiontypes');
          $scope.exceptionReasons = ConstantsResource.get('reasons');
          $scope.marginExceptionTypes = ConstantsResource.get('marginexceptiontypes');

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

          // open add/edit exception window
          $scope.openAgenciesAddingMargin = function(product, exception) {
            ModalService.open({
              templateUrl: 'views/candidate/_adding_margin_exceptions.html',
              parentScope: $scope,
              params: {payrollProduct: product, editingException: exception, candidateId: candidateId},
              controller: '_CandidateAgenciesAddingMarginController'
            });
          };
          
          $scope.deleteMarginException = function(product, exception){
            var exceptionResource = HttpResource.model('candidates/' + candidateId + '/payrollproduct/' + product._id + '/marginexception');
            exceptionResource.delete(exception._id).then(function(response) {
              if (!HttpResource.flushError(response)) {
                //remove row from the grid
                jQuery(product.marginException).each(function(index) {
                  if (this._id === exception._id) {
                    product.marginException.splice(index, 1);
                  }
                });
              }
            });
          };

        })

        // Add/Edit Margin Exceptions
        .controller('_CandidateAgenciesAddingMarginController', function($scope, $modalInstance, HttpResource, ConstantsResource, params) {
          
          var exceptionResource = HttpResource.model('candidates/' + params.candidateId + '/payrollproduct/' + params.payrollProduct._id + '/marginexception');
          
          $scope.data = {};
          if(params.editingException){
            angular.copy(params.editingException, $scope.data);
            $scope.editing = true;
          }
          
          $scope.deductionTypes = ConstantsResource.get('deductiontypes');
          $scope.exceptionReasons = ConstantsResource.get('reasons');
          $scope.marginExceptionTypes = ConstantsResource.get('marginexceptiontypes');
          
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          
          //save margin exception information
          $scope.saveException = function() {
            var successCallback = function(response) {
              $scope.isSaving = false;
              if (!HttpResource.flushError(response)) {
                if ($scope.editing) { //if edited
                  jQuery(params.payrollProduct.marginException).each(function(index) {
                    if (this._id === $scope.data._id) {
                      angular.copy($scope.data, params.payrollProduct.marginException[index]);
                    }
                  });
                } else { //if added
                  params.payrollProduct.marginException.push($scope.data);
                }
                $scope.data = {};
                $modalInstance.close();
              }
            };
            
            $scope.isSaving = true;
            var sendData = exceptionResource.create($scope.data);
            if ($scope.editing) {
              sendData.patch()
                      .then(successCallback);
            } else {
              sendData.post()
                      .then(successCallback);
            }
          };
		  $scope.disabled = function(date, mode) {
			return ( mode === 'day' && ( date.getDay() !== 0 ) );
		  };
			
        });