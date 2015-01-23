'use strict';
angular.module('origApp.controllers')
        .controller('AgencyConsultantsController', function($scope, ModalService, HttpResource, $stateParams, MsgService) {

          $scope.agencyId = $stateParams.agencyId;
          $scope.branches = HttpResource.model('agencies/' + $scope.agencyId + '/branches').query({});

          $scope.openAgencyBranchModal = function(branch) {
            ModalService.open({
              templateUrl: 'views/agency/_modal_branch.html',
              parentScope: $scope,
              params: {branch: branch, agencyId: $scope.agencyId},
              controller: '_AgencyBranchModalController'
            });
          };

          $scope.openAgencyConsultantModal = function(branch, consultant) {
            ModalService.open({
              templateUrl: 'views/agency/_modal_consultant.html',
              parentScope: $scope,
              params: {
                branch: branch,
                consultant: consultant,
                agencyId: $scope.agencyId
              },
              controller: '_AgencyConsultantModalController'
            });
          };

          $scope.deleteAgencyBranch = function(branch) {
            if (!confirm('Are you sure to delete this branch?')) {
              return;
            }
            $scope.isDeletingBranch = true;
            HttpResource.model('agencies/branches').delete(branch._id).then(function(response) {
              $scope.isDeletingBranch = false;
              if (!HttpResource.flushError(response)) {
                //remove row from the grid
                $scope.branches.forEach(function(b, index) {
                  if (b._id === branch._id) {
                    $scope.branches.splice(index, 1);
                  }
                });
              }
            });
          };

          $scope.changeConsultantLockStatus = function(consultant) {
            HttpResource.model('agencies/consultants/' + consultant._id + '/lockunlock')
                    .patch(consultant.locked ? 0 : 1).then(function(response) {
              if (!HttpResource.flushError(response)) {
                consultant.locked = !consultant.locked;
              }
            });
          };

          $scope.deleteAgencyConsultant = function(branch, consultant) {
            if (!confirm('Are you sure to delete this consultant?')) {
              return;
            }
            HttpResource.model('agencies/consultants').delete(consultant._id).then(function(response) {
              if (!HttpResource.flushError(response)) {
                //remove row from the grid
                branch.consultants.forEach(function(c, index) {
                  if (c._id === consultant._id) {
                    branch.consultants.splice(index, 1);
                  }
                });
              }
            });
          };
          
          $scope.changeConsultantPassword = function(consultant){
            if (!confirm('Are you sure to change password of this consultant?')) {
              return;
            }
            HttpResource.model('agencies/consultants/' + consultant._id + '/changepassword')
                    .post().then(function(response) {
              if (!HttpResource.flushError(response)) {
                MsgService.success('Email with reset password link has been sent to consultant.');
              }
            });
          };

        })

        //Agency Branch modal
        .controller('_AgencyBranchModalController', function($scope, $modalInstance, params, HttpResource, parentScope) {
          $scope.data = {};
          $scope.editingBranch = params.branch || null;
          $scope.agencyId = params.agencyId;
          if ($scope.editingBranch) {
            angular.copy($scope.editingBranch, $scope.data);
          }
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.ok = function() {
            var successCallback = function(response) {
              $scope.isSaving = false;
              if (!HttpResource.flushError(response)) {
                if ($scope.editingBranch) {
                  $scope.editingBranch = jQuery.extend($scope.editingBranch, $scope.data);
                } else {
                  parentScope.branches.push(HttpResource.model('agencies/branches').create(response.data.object));
                }
                $modalInstance.close();
              }
            };
            $scope.isSaving = true;
            if ($scope.editingBranch) {
              HttpResource.model('agencies/branches').create($scope.data)
                      .patch($scope.editingBranch._id)
                      .then(function(response) {
                        successCallback(response);
                      });
            } else {
              HttpResource.model('agencies/' + $scope.agencyId + '/branches').create($scope.data)
                      .post()
                      .then(function(response) {
                        successCallback(response);
                      });
            }
          };
        })

        //Agency Consultant modal
        .controller('_AgencyConsultantModalController', function($scope, $modalInstance, params, HttpResource, ConstantsResource) {
          $scope.statuses = ConstantsResource.get('statuslist');
          $scope.roles = ConstantsResource.get('roleslist');

          $scope.data = {};
          $scope.branch = params.branch;
          $scope.editingConsultant = params.consultant || null;
          if ($scope.editingConsultant) {
            angular.copy($scope.editingConsultant, $scope.data);
          }

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.ok = function() {
            var successCallback = function(response) {
              $scope.isSaving = false;
              if (!HttpResource.flushError(response)) {
                if ($scope.editingConsultant) {
                  $scope.editingConsultant = jQuery.extend($scope.editingConsultant, $scope.data);
                } else {
                  $scope.branch.consultants.push(HttpResource.model('agencies/consultants').create(response.data.object));
                }
                $modalInstance.close();
              }
            };
            $scope.isSaving = true;
            var sendData = {};
            angular.copy($scope.data, sendData);
            if ($scope.data.status)
              sendData.status = $scope.data.status.code;
            if ($scope.data.role)
              sendData.role = $scope.data.role.code;
            if ($scope.editingConsultant) {
              HttpResource.model('agencies/consultants').create(sendData)
                      .patch($scope.editingConsultant._id)
                      .then(function(response) {
                        successCallback(response);
                      });
            } else {
              HttpResource.model('agencies/branches/' + $scope.branch._id + '/consultants').create(sendData)
                      .post()
                      .then(function(response) {
                        successCallback(response);
                      });
            }
          };
        });

