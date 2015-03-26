'use strict';

angular.module('origApp.controllers')
    .controller('AgencyLogoUploadController', function ($scope, $modalInstance, $http, parentScope, HttpResource) {

        $scope.temp = {};

        if (Object.keys(parentScope.agency).length) {
            $scope.agency = parentScope.agency;
            $scope.temp = {
                logoFileName : $scope.agency.logoFileName,
                dataUrl : $scope.agency.logoUrl
            };

        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {
            $modalInstance.dismiss();
        };

        $scope.$watch('companyLogo', function (fileInfo) {

            if (fileInfo) {

                var fileSize =  (fileInfo.size / 1024);
                var picReader = new FileReader();
                picReader.readAsDataURL(fileInfo);

                picReader.addEventListener("load", function (event) {
                    $scope.temp.dataUrl = event.target.result;
                    $scope.$digest();
                });

                $scope.temp = {
                    logoFileName : fileInfo.name,
                    logoSize : fileSize
                };
            }

        });

        /*Uploding file to aws S3*/
        $scope.uploadCompanyLogo = function () {

            var agencyId =  $scope.agency._id;

            if (!$('#upload_company_logo').val()) {
                alert('Please select a file first.');
                return;
            }
            var file = $scope.companyLogo;
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

    }).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);