'use strict';

angular.module('origApp.controllers')
    .controller('smpController', function($scope, parentScope, HttpResource, $http, ModalService, MsgService, $modalInstance) {
        $scope.candidateId = parentScope.candidateId;
        $scope.candidate = parentScope.candidate;

        $scope.cancel = function(i, v) {

            $scope.smpObject.days[i].amount = v;
        };
        $scope.remove = function(i) {

            $scope.smpObject.days.splice(i, 1);

        };

        $scope.$watch('fileupload', function(fileInfo) {
            if (fileInfo) {
                var fileSize = (fileInfo.size / 1024);
                var picReader = new FileReader();
                picReader.readAsDataURL(fileInfo);

                picReader.addEventListener('load', function(event) {
                    $scope.temp.dataUrl = event.target.result;
                    $scope.$digest();
                });

                $scope.temp = {
                    logoFileName: fileInfo.name,
                    logoSize: fileSize.toFixed(0) + ' KB'
                };
            }

        });
        $scope.uploadFile = function() {



            if (!$('#upload_file').val()) {
                MsgService.danger('Please select a file first.');
                return;
            }
            var file = $scope.fileupload;
            var fileName = new Date().getTime().toString() + '_' + file.name;
            var mimeType = file.type || 'text/plain';
            $scope.isLogoUploading = true;
            HttpResource.model('documents/actionrequest').customGet('signedUrl', {
                mimeType: mimeType,
                fileName: fileName
            }, function(response) {
                $scope.signedUrl = response.data.signedRequest;
                $http({
                    method: 'PUT',
                    url: $scope.signedUrl,
                    data: file,
                    headers: {
                        'Content-Type': mimeType,
                        'x-amz-acl': 'public-read'
                    }
                }).success(function() {
                    $scope.smpObject.imageUrl = response.data.url;
                    $scope.isLogoUploading = false;
                });


            });
        };
        $scope.save = function() {
            HttpResource.model('actionrequests').create($scope.smpObject)
                .patch($scope.smpObject.id).then(function() {
                    MsgService.success('Successfully saved.');
                    $scope.closeModal();
                });
        };
        $scope.saveAndApprove = function() {

            HttpResource.model('actionrequests/' + $scope.smpObject.id + '').create('')
                .patch('approve').then(function() {
                    MsgService.success('Successfully saved and approved.');

                });

        };
        $scope.saveAndReject = function() {

            HttpResource.model('actionrequests/' + $scope.smpObject.id + '').create('')
                .patch('reject').then(function() {
                    MsgService.success('Successfully saved and approved.');

                });

        };
        $scope.saveAndRefer = function() {

            HttpResource.model('actionrequests/' + $scope.smpObject.id + '').create('')
                .patch('refer').then(function() {
                    MsgService.success('Successfully saved and approved.');

                });

        };
        $scope.closeModal = function() {

            $modalInstance.dismiss('cancel');
        };

    });
