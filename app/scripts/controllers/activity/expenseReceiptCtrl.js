﻿'use strict';
var app = angular.module('origApp.controllers');

app.controller('expenseReceiptCtrl', function ($scope, $modalInstance, $http, rootScope, receiptUrls, s3Service, $q, HttpResource) {
    //$scope.generatingPreview = false;
    var canceller = $q.defer();
    var uploadCancelled = false;
    var signedRequest;
    var uploadSuccess = false;
    $scope.uploadedImg = {};

    $scope.validFile = false;
    $scope.uploading = false;
    var fileName, fileType;

    $scope.receiptUrls = receiptUrls;
    $scope.actualUrls = [];
    $scope.receiptUrls.forEach(function (justName) {
        console.log(justName);
        //setTimeout(function () {
        //    window.open($http.get('/api/documents/receipt/' + justName), 'docviewFrame');
        //}, 100);
        //$scope.actualUrls.push({
        //    name: justName,
        //    img: justName
        //});
        $http.get('/api/documents/receipts/' + justName).success(function (res) {
            logs(res, 'actual url');
            $scope.actualUrls.push({
                name: justName,
                img: res.url
            });
        });
    });

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
        image.addEventListener('error', showUploadError);
        //$scope.generatingPreview = false;
        //$scope.$apply;
    },
    showUploadError = function () {
        alert('Incorrect image format. Please choose correct image.');
        $scope.validFile = false;
    },
    loadImageData = function (file, filereader) {
        document.getElementById("uploadFile").innerHTML = file.name;
        document.getElementById("filesize").innerHTML = this.width + 'x' + this.height + ' px, ' + ~~(file.size / 1024) + ' KB';
        document.getElementById('logo').src = this.src;
        var icon = document.getElementById('iconCheck');
        icon.classList.remove('fa', 'fa-spinner', 'fa-spin');
        icon.classList.add('fa', 'fa-check');
        $scope.validFile = true;
    };

    //$(window).load(function () {
    //    document.getElementById("uploadBtn").addEventListener('change', function () {
    //        logs('changed');
    //        if (this.files && this.files[0]) readFile(this.files[0]);
    //    });
    //});

    $scope.generatePreview = function (file) {
        $scope.$apply();
        $scope.file = file.files[0];
        if (file) readFile(file.files[0]);
    }


    $scope.uploadFile = function () {
        if ($scope.validFile) {
            $scope.uploading = true;
            logs('uploading ...');
            canceller = $q.defer();
            uploadCancelled = false;

            HttpResource.model('documents/receipts').customGet('signedUrl', {
                mimeType: fileType,
                fileName: fileName
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
                    uploadSuccess = true;
                    if (uploadCancelled) {
                        $scope.uploadStatus = 'Uploaded cancelled';
                    } else {
                        $scope.uploadStatus = 'Uploaded successfully';
                        $scope.uploadedImg.url = response.data.url;
                        logs($scope.uploadedImg, 'the url');
                    }
                }).error(function () {
                    $scope.uploadStatus = 'Upload failure';
                });
            });

        } else {
            alert('No valid file selected');
        }
    }

    $scope.cancelUpload = function () {
        canceller.resolve("upload cancelled");
        uploadCancelled = true;
        $scope.uploading = false;
    }

    $scope.ok = function () {
        if (uploadSuccess)
            $scope.receiptUrls.push(fileName);
        $modalInstance.close();
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancelled');
    };

    function logs(record, label) {
        if (label) console.log(label + ':', record);
        else console.log(record);
    }
});