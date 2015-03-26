'use strict';

angular.module('origApp.controllers')
        .controller('AgencyHomeController', function ($scope, $stateParams, ModalService, HttpResource, ConstantsResource, $http) {
            $scope.agencyId = $stateParams.agencyId;
            $scope.countries = ConstantsResource.get('countries');
            //console.log($scope.$parent.agencyStatus);

            function loadAgency() {
                $scope.agency = HttpResource.model('agencies').get($scope.agencyId);
            }

            function loadAgencyContact() {
                $scope.agencyContact = HttpResource.model('agencies/' + $scope.agencyId).get('contact');
            }


            $scope.getConstant = function (constantKey, code) {
                var hashData = ConstantsResource.getHashData(constantKey);
                if (!hashData || !hashData[code]) {
                    return {};
                }
                return hashData[code];
            };

            $scope.openAgencyEdit = function () {
                ModalService.open({
                    templateUrl: 'views/agency/_modal_agency.html',
                    parentScope: $scope,
                    controller: 'AgencyEditController'
                });
            };


            $scope.openPhotoUpload = function () {
               ModalService.open({
                    templateUrl: 'views/agency/_modal_upload_logo.html',
                    parentScope: $scope,
                    controller: 'AgencyLogoUploadController'
                });
            };

            $scope.openContactEdit = function () {
                ModalService.open({
                    templateUrl: 'views/agency/_agency_contact_edit.html',
                    parentScope: $scope,
                    controller: '_AgencyContactEditController'
                });
            };

            loadAgency();
            loadAgencyContact();

            $scope.addSubBreadcrumb(null);

        })

        // edit agency contact information
        .controller('_AgencyContactEditController', function ($scope, $modalInstance, parentScope, HttpResource) {
            $scope.status = parentScope.$parent.selectedAgency.status;
            $scope.ukPhone = /^[0]+(\d{10})+$/;
            $scope.emailPat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
            $scope.fields = [
              { name: 'phone1', label: 'Phone 1', required: ($scope.status === 'Live') ? true : false },
              { name: 'phone2', label: 'Phone 2' },
              { name: 'fax', label: 'Fax' },
              { name: 'facebook', label: 'Facebook' },
              { name: 'linkedin', label: 'Linkedin' },
              { name: 'website', label: 'Website', type: 'url' },
              { name: 'email', label: 'Email', type: 'email', required: ($scope.status === 'Live') ? true : false, pat: $scope.emailPat }
            ];
            $scope.data = {};

            if (parentScope.agencyContact) {
                $scope.fields.forEach(function (item) {
                    $scope.data[item.name] = parentScope.agencyContact[item.name];
                });
            }

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.ok = function () {
                $scope.isSaving = true;
                HttpResource.model('agencies/' + parentScope.agencyId).create($scope.data)
                        .patch('contact')
                        .then(function (response) {
                            $scope.isSaving = false;
                            if (!HttpResource.flushError(response)) {
                                parentScope.agencyContact = jQuery.extend(parentScope.agencyContact, $scope.data);
                                $modalInstance.close();
                            }
                        });

            };
        });


