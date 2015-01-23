'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarOnboardingController', function($scope, $modalInstance, parentScope, HttpResource, ConstantsResource, ModalService) {
          var candidateInfo = parentScope.candidate;
          var candidateResource = HttpResource.model('candidates/' + candidateInfo._id);
          function arrayIntersect(a, b) {
            var t;
            if (b.length > a.length)
              t = b, b = a, a = t; // indexOf to loop over shorter
            return a.filter(function(e) {
              if (b.indexOf(e) !== -1)
                return true;
            });
          }


          $scope.serviceUsed = ConstantsResource.get('servicesused');
          $scope.agencies = HttpResource.model('agencies').query({});
          $scope.data = candidateResource.get('onboarding');

          $scope.getAgencyConsultants = function(agencyID) {
            var agencies = $scope.agencies.filter(function(agency) {
              return agency._id === agencyID;
            });
            var branches = agencies.length > 0 ? agencies[0].branches : [];
            var consultants = [];
            branches.forEach(function(branch) {
              consultants = consultants.concat(branch.consultants || []);
            });
            return consultants;
          };

          $scope.getServiceUsed = function(serviceUsedID) {
            var services = $scope.serviceUsed.filter(function(service) {
              return service.code === serviceUsedID;
            });
            return services[0] || null;
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };

          $scope.save = function(isComplete) {
            var reqList = $scope.data.serviceUsedObj ? $scope.data.serviceUsedObj.requirement_list : [];
            $scope.data.requirements = arrayIntersect(reqList, $scope.data.requirements);
            var sendData = candidateResource.create($scope.data);
            if(isComplete){
              $scope.isCompleting = true;
              sendData.complete = 1;
            }else{
              $scope.isSaving = true;
              sendData.complete = 0;
            }
            sendData.patch('onboarding')
                    .then(function(response) {
                      if(isComplete){
                        $scope.isCompleting = false;
                      }else{
                        $scope.isSaving = false;
                      }
                      if (!HttpResource.flushError(response)) {
                        $modalInstance.close();
                      }
                    });
          };
          
          $scope.showScript = function(script){
            ModalService.open({
              templateUrl: 'views/candidate/_onboarding_script.html',
              params: {onboarding_script: script},
              controller: function($scope, params){
                $scope.onboarding_script = params.onboarding_script;
              }
            });
          };
          
          $scope.$watch('data.service_used', function(){
            $scope.data.serviceUsedObj = $scope.getServiceUsed($scope.data.service_used);
          });
        });

