'use strict';
angular.module('origApp.controllers')
    .controller('p45Ctrl', function ($scope, parentScope, $http, $modalInstance, s3Service, $q) {

        $scope.candidate = parentScope.candidate;
        var canceller = $q.defer();
        var uploadCancelled = false;
        var signedRequest;
        var uploadSuccess = false;
        $scope.validFile = false;
        $scope.uploading = false;
        var fileName, fileType;

        $(document).ready(function () {
            $('#datepickerFrom').datepicker({
                orientation: "top auto"
            });
            $('#datepickerTo').datepicker({
                orientation: "top auto"
            });
            $("#uploadFile").css({ 'word-wrap': "break-word" });
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
        },
        loadImageData = function (file, filereader) {
            document.getElementById("uploadFile").innerHTML = file.name;
            $("#uploadFile").css({ 'word-wrap': "break-word" });
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

        $scope.ok = function () {
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
