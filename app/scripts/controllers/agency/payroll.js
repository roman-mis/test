'use strict';
angular.module('origApp.controllers')
        .controller('AgencyPayrollController', function ($scope, ModalService, $stateParams, HttpResource, ConstantsResource) {
            $scope.agencyId = $stateParams.agencyId;

            function loadPayrollData() {
                $scope.payrollData = HttpResource.model('agencies/' + $scope.agencyId).get('payroll');
            }

            $scope.getConstant = function (constantKey, code) {
                var hashData = ConstantsResource.getHashData(constantKey);
                if (!hashData || !hashData[code]) {
                    return {};
                }
                return hashData[code];
            };

            $scope.openAgencyDefaultInvoicing = function () {
                ModalService.open({
                    templateUrl: 'views/agency/_edit_default_invoicing.html',
                    parentScope: $scope,
                    controller: '_EditAgencyDefaultInvoicing',
                    size: 'lg'
                });
            };

            $scope.openAgencyDefaultPayroll = function () {
                ModalService.open({
                    templateUrl: 'views/agency/_edit_default_payroll.html',
                    parentScope: $scope,
                    controller: '_EditAgencyDefaultPayroll'
                });
            };

            loadPayrollData();

        })

        //Edit Agency Default Invoicing
        .controller('_EditAgencyDefaultInvoicing', function ($scope, $modalInstance, parentScope, HttpResource, ConstantsResource) {
            $scope.data = {};
            $scope.status = parentScope.$parent.agencyStatus;
            $scope.emailPat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
            $scope.options = [{ code: true, value: 'Yes' }, { code: false, value: 'No' }];

            angular.copy(parentScope.payrollData.defaultInvoicing, $scope.data);
            for (var key in $scope.data) {
                if ($scope.data[key]) {
                    if ($scope.data[key].code) {
                        $scope.data[key] = $scope.data[key].code;
                    }
                    if ($scope.data[key]._id) {
                        $scope.data[key] = $scope.data[key]._id;
                    }
                }
            }

            $scope.invoiceMethods = ConstantsResource.get('invoicemethods');
            $scope.paymentTerms = ConstantsResource.get('paymentterms');
            $scope.invoiceDesigns = HttpResource.model('invoicedesigns').query({});

            $scope.agency = HttpResource.model('agencies').get(parentScope.agencyId);

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.ok = function () {
                $scope.isSaving = true;
                HttpResource.model('agencies/' + parentScope.agencyId).create($scope.data)
                        .patch('payroll')
                        .then(function (response) {
                            $scope.isSaving = false;
                            if (!HttpResource.flushError(response)) {
                                parentScope.payrollData = jQuery.extend(parentScope.payrollData, response.data.object);
                                $modalInstance.close();
                            }
                        });
            };
        })

        //Edit Agency Default Payroll
        .controller('_EditAgencyDefaultPayroll', function ($scope, $modalInstance, parentScope, HttpResource, ConstantsResource) {
            $scope.data = {};
            $scope.status = parentScope.$parent.agencyStatus;
            $scope.options = [{ code: true, value: 'Yes' }, { code: false, value: 'No' }];

            angular.copy(parentScope.payrollData.defaultPayroll, $scope.data);
            for (var key in $scope.data) {
                if ($scope.data[key]) {
                    if ($scope.data[key].code) {
                        $scope.data[key] = $scope.data[key].code;
                    }
                    if ($scope.data[key]._id) {
                        $scope.data[key] = $scope.data[key]._id;
                    }
                }
            }

            $scope.serviceUsed = ConstantsResource.get('servicesused');
            $scope.marginTypes = ConstantsResource.get('margintypes');

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.ok = function () {
                $scope.isSaving = true;
                HttpResource.model('agencies/' + parentScope.agencyId).create($scope.data)
                        .patch('payroll')
                        .then(function (response) {
                            $scope.isSaving = false;
                            if (!HttpResource.flushError(response)) {
                                parentScope.payrollData = jQuery.extend(parentScope.payrollData, response.data.object);
                                $modalInstance.close();
                            }
                        });
            };
        });