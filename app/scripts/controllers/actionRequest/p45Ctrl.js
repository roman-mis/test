'use strict';
angular.module('origApp.controllers')
    .controller('p45Ctrl', function ($scope, parentScope, $http, $modalInstance, s3Service, $q, MsgService, HttpResource) {

        $scope.candidate = parentScope.candidate;
        var canceller = $q.defer();
        var uploadCancelled = false;
        var signedRequest;
        var uploadSuccess = false;
        $scope.validFile = false;
        $scope.uploading = false;
        var fileName, fileType, uploadedFileName;
        var uploadedFile = '';

        //$(document).ready(function () {
        //    $('#datepickerFrom').datepicker({
        //        orientation: "top auto"
        //    });
        //    $('#datepickerTo').datepicker({
        //        orientation: "top auto"
        //    });
        //});

        var readFile = function (file) {
            logs(file, 'file');
            fileName = file.name;
            fileType = file.type;
            //$scope.generatingPreview = true;
            var icon = document.getElementById('iconCheck');
            icon.classList.add('fa', 'fa-spinner', 'fa-spin');
            var fr = new FileReader();
            fr.readAsDataURL(file);
            fr.addEventListener('load', onReadFinished.bind(fr, file));
        },
        onReadFinished = function (file, filereader) {
            var image = new Image();
            image.src = filereader.target.result;
            image.addEventListener('load', loadImageData.bind(image, file, filereader));
        },
        loadImageData = function (file, filereader) {
            document.getElementById("uploadFileCustom").innerHTML = file.name;
            document.getElementById("fileSize").innerHTML = humanFileSize(file.size);
            logs(humanFileSize(file.size), 'the mighty file ' + file.name);
            var icon = document.getElementById('iconCheck');
            icon.classList.remove('fa', 'fa-spinner', 'fa-spin');
            icon.classList.add('fa', 'fa-check');
            $scope.validFile = true;
        };

        $scope.generatePreview = function (file) {
            $scope.$apply();
            $scope.file = file.files[0];
            logs($scope.file, 'file watcher');
            if (file != undefined) readFile(file.files[0]);
        }

        $scope.uploadFile = function () {
            if ($scope.validFile) {
                $scope.uploading = true;
                logs('uploading ...');
                canceller = $q.defer();
                uploadCancelled = false;
                uploadedFileName = new Date().getTime().toString() + '_' + fileName;

                HttpResource.model('documents/actionrequest').customGet('signedUrl', {
                    mimeType: fileType,
                    fileName: uploadedFileName
                }, function (response) {
                    signedRequest = response.data.signedRequest;
                    $http({
                        method: 'PUT',
                        url: signedRequest,
                        data: $scope.file,
                        headers: { 'Content-Type': fileType, 'x-amz-acl': 'public-read' },
                        timeout: canceller.promise
                    }).success(function () {
                        //get view url of file
                        $scope.uploading = false;
                        if (uploadCancelled) {
                            $scope.uploadStatus = 'Uploaded cancelled';
                            MsgService.warn('Upload cancelled');
                        } else {
                            uploadedFile = uploadedFileName;
                            uploadSuccess = true;
                            $scope.uploadStatus = 'Uploaded successfully';
                            MsgService.success('Upload Successful');
                            //$http.get('/api/documents/receipts/viewsignedurl/' + uploadedFileName).success(function (res) {
                            //    logs(res, 'response');
                            //});
                        }
                    }).error(function () {
                        $scope.uploadStatus = 'Upload failure';
                    });
                });

            } else {
                MsgService.danger('No valid file selected');
            }
        }

        function humanFileSize(bytes, si) {
            var thresh = si ? 1000 : 1024;
            if (bytes < thresh) return bytes + ' B';
            var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var u = -1;
            do {
                bytes /= thresh;
                ++u;
            } while (bytes >= thresh);
            return bytes.toFixed(1) + ' ' + units[u];
        }

        $scope.cancelUpload = function () {
            canceller.resolve("upload cancelled");
            uploadCancelled = true;
            $scope.uploading = false;
        }

        $scope.ok = function () {
            var req = {};
            req.p45 = {};
            req.p45.dateRequested = $scope.dateRequested;
            req.p45.leavingDate = $scope.leavingDate;
            req.imageUrl = uploadedFile;
            HttpResource.model('actionrequests/' + $scope.candidate._id + '/p45').create(req).post().then(function () {
                MsgService.success('Successfully submitted.');
                $modalInstance.close();
            }, function (error) {
                logs(error, 'submitting error');
                MsgService.danger(error);
            });
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancelled');
        };

        function logs(record, label) {
            if (label) console.log(label + ':', record);
            else console.log(record);
        }
    });
