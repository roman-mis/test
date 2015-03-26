'use strict';

angular.module('origApp.controllers')
    .controller('AgencyLogoUploadController', function ($scope, $modalInstance, $http, parentScope, HttpResource) {

        if (Object.keys(parentScope.agency).length) {
            $scope.agency = parentScope.agency;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {
            $modalInstance.dismiss();
        };

        /*Uploding file to aws S3*/
        $scope.uploadCompanyLogo = function () {

            var agencyId =  $scope.agency._id;

            if (!$('#upload_company_logo').val()) {
                alert('Please select a file first.');
                return;
            }
            var file = $('#upload_company_logo')[0].files[0];
            var fileName = new Date().getTime().toString() + '_' + file.name;
            var mimeType = file.type || 'text/plain';
            $scope.isLogoUploading = true;
            HttpResource.model('agencies/' + agencyId).customGet('logosignedurl', {
                mimeType: mimeType,
                fileName: fileName
            }, function (response) {
                var signedRequest = response.data.signedRequest;
                $http({
                    method: 'PUT',
                    url: signedRequest,
                    data: file,
                    headers: { 'Content-Type': mimeType, 'x-amz-acl': 'public-read' }
                }).success(function () {
                    HttpResource.model('agencies').create({ logoFileName: fileName })
                        .patch(agencyId)
                        .then(function (response) {
                            $scope.isLogoUploading = false;
                            if (!HttpResource.flushError(response)) {
                                $scope.agency = HttpResource.model('agencies').get(agencyId);
                            }
                        });
                });
            });
        };

    });