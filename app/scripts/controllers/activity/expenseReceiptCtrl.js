'use strict';
var app = angular.module('origApp.controllers');

app.controller('expenseReceiptCtrl', function ($scope, $modalInstance, $http, rootScope) {
    //$scope.generatingPreview = false;

    var readFile = function (file) {
        //logs(file, 'file');
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
    },
    loadImageData = function (file, filereader) {
        document.getElementById("uploadFile").innerHTML = file.name;
        document.getElementById("filesize").innerHTML = this.width + 'x' + this.height + ' px, ' + ~~(file.size / 1024) + ' KB';
        document.getElementById('logo').src = this.src;
        var icon = document.getElementById('iconCheck');
        icon.classList.remove('fa', 'fa-spinner', 'fa-spin');
        icon.classList.add('fa', 'fa-check');
    };

    //$(window).load(function () {
    //    document.getElementById("uploadBtn").addEventListener('change', function () {
    //        logs('changed');
    //        if (this.files && this.files[0]) readFile(this.files[0]);
    //    });
    //});

    $scope.generatePreview = function (file) {
        $scope.$apply();
        if (file) readFile(file.files[0]);
    }

    $(document).on("change", "uploadBtn", function () {
        logs('changed');
        $scope.uploadFile();
    });

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