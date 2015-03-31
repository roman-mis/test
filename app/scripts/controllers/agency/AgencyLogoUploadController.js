'use strict';

angular.module('origApp.controllers')
    .controller('AgencyLogoUploadController', function ($scope, $modalInstance, $http, $stateParams, HttpResource) {

        $scope.temp = {};
        var agencyId = $stateParams.agencyId;
        var agency = {};

        function getAgencyById(agencyId) {

            return HttpResource.model('agencies').customGet(agencyId, {}, function (res) {

                agency = res.data.object;
                $scope.temp = {
                    logoFileName : agency.logoFileName,
                    dataUrl : agency.logoUrl
                };
            });
        }

        getAgencyById(agencyId);
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

                picReader.addEventListener('load', function (event) {
                    $scope.temp.dataUrl = event.target.result;
                    $scope.$digest();
                });

                $scope.temp = {
                    logoFileName : fileInfo.name,
                    logoSize : fileSize
                };
            }

        });

        $scope.deleteCompanyLogo = function () {
            if (!$scope.temp.logoFileName) {
                alert('There are no files to delete.');
            }

            HttpResource.model('agencies/' + agencyId + '/logo').delete({
                fileName: $scope.temp.logoFileName
            }).then(function () {
                getAgencyById(agencyId);
            }, function (error) {
                /*@todo gracefully handle error*/
            });
        };

        /*Uploading file to aws S3*/
        $scope.uploadCompanyLogo = function () {

            if (!$scope.companyLogo) {
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
                                getAgencyById(agencyId);
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
